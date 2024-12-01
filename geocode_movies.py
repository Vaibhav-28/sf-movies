import os
import requests
import json
from dotenv import load_dotenv
import time
import re

load_dotenv(dotenv_path=".env.local")

APP_TOKEN = os.getenv('APP_TOKEN')
if not APP_TOKEN:
    raise ValueError("APP_TOKEN is not set in the .env.local file")

API_URL = f"https://data.sfgov.org/resource/yitu-d5am.json?$$app_token={APP_TOKEN}&$limit=3000"


def geocode_location(location):
    viewbox = "-123.173825,37.63983,-122.28178,37.929824"  # SW and NE corners
    api_url = (
        f"https://nominatim.openstreetmap.org/search?"
        f"q={location}&format=json&limit=1"
        f"&viewbox={viewbox}&bounded=1"  
    )
    headers = {
        "User-Agent": "SF Movies (sisodiasinghvaibhav@gmail.com)" 
    }
    try:
        response = requests.get(api_url,headers=headers)
        response.raise_for_status()  
        data = response.json()
        if data:
            return {"lat": data[0]["lat"], "lng": data[0]["lon"]}
        else:
            print(f"No results for location: {location}")
            return None
    except Exception as e:
        print(f"Error geocoding {location}: {e}")
        return None

def fetch_movies():
    try:
        response = requests.get(API_URL)
        response.raise_for_status()  
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching movie data: {e}")
        return []

def preprocess_location(location):
    # Strip extra whitespace
    location = location.strip()

    # Handle specific patterns and symbols
    location = re.sub(r'\s*@\s*', ', ', location)  # Replace @ with comma
    location = re.sub(r'\s*btwn\s*', ', ', location)  # Replace 'btwn' with comma
    location = re.sub(r'\s*between\s*', ', ', location)  # Replace 'between' with comma

    # Remove parenthetical information only if it seems unnecessary
    location = re.sub(r'\(.*?\)', '', location).strip()

    # Handle intersections: leave '/' if it denotes an intersection (e.g., "1st Ave / Broadway")
    location = location.replace('&', ' and ')  # Handle '&' as 'and'
    location = location.replace(';', ',')  # Standardize semicolon to comma
    # We will now leave '/' for intersections, instead of replacing with "and"
    location = re.sub(r'(\d+\w*\s?\/\s?\d+\w*)', lambda x: x.group(0), location)

    # Standardize common street suffixes
    location = re.sub(r'\bSt\.?\b', 'Street', location, flags=re.IGNORECASE)  
    location = re.sub(r'\bAve\b', 'Avenue', location, flags=re.IGNORECASE)
    location = re.sub(r'\bRd\b', 'Road', location, flags=re.IGNORECASE)

    # Handle specific words that might interfere with geocoding (only remove if irrelevant)
    remove_words = ['Garage', 'Building', 'Complex']  # Avoid removing 'The' for proper names
    for word in remove_words:
        location = location.replace(word, '').strip()

    # Clean up unnecessary white space and multiple spaces
    location = re.sub(r'\s+', ' ', location).strip()

    return location

def main():

    movies = fetch_movies()
    if not movies:
        print("No movies found.")
        return
    else:
        print(len(movies),"movies found")

    geocoded_movies = []
    i = 0
    size = len(movies)
    for movie in movies:
        i+=1
        location = movie.get("locations")
        if location:
            location = preprocess_location(location)

            print(f" ({i}/{size}) Geocoding: {movie.get('title')} ({movie.get('locations')})")
            coords = geocode_location(location)
            time.sleep(1)
            if coords:
                geocoded_movies.append({**movie, **coords})

    output_path = "./src/data/geocodedMovies.json" 
    with open(output_path, "w") as outfile:
        json.dump(geocoded_movies, outfile, indent=2)
    print(f"Geocoding completed. Results saved to {output_path}")

if __name__ == "__main__":
    main()
