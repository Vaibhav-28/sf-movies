# Movie Locations in San Francisco Web App

This project is a web application that displays movie filming locations on a map in San Francisco. The app uses React, Leaflet, and OpenStreetMap to visualize the locations where movies were filmed. Users can filter the displayed locations using an autocomplete search with three filters: by movie title, by year, and by location. These filters can be combined for a more precise search.

## Features

- **Interactive Map**: Displays movie filming locations in San Francisco using **Leaflet** and **OpenStreetMap**.
- **Search Filters**: Allows users to filter locations by:
  - **Movie Title**: Search by the movie title.
  - **Year**: Filter the locations by the year of the movie's release.
  - **Location**: Filter by the filming location (i.e., the geographic location of where the movie was filmed).
- **Autocomplete Search**: Filters use an autocomplete search that suggests possible matches as users type.
- **Data Fetching and Geocoding**:
  - A Python script fetches movie data from the [San Francisco Film Locations API](https://data.sfgov.org/resource/yitu-d5am.json).
  - The app geocodes movie locations using **Nominatim** to get latitude and longitude for each movie (where possible).

## Tech Stack

- **Frontend**:
  - **React**: JavaScript library for building the user interface.
  - **Leaflet**: JavaScript library for interactive maps.
  - **OpenStreetMap**: Open-source map tiles for displaying movie locations.
  - **React-Leaflet**: React components for integrating Leaflet with React.
- **Backend**:
  - **Python Script**: Used to fetch movie data from the API and geocode locations using Nominatim.

## Steps to Run the Application Locally

### Frontend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/sf-movies.git
   cd sf-movie-locations
   ```

2. Copy environment example file

   ```bash
   cp .env.example .env
   ```

3. Fill in the SF Movies API token in the `.env` file

4. Install dependencies

   ```bash
   npm install
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

### Backend Python Script Setup (Optional)

1. Create a virtual environment

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate.bat`
   ```

2. Install required dependencies
   ```bash
   pip install -r requirements.txt
   ```

#### Why Run the Backend Script?

The Python script serves two primary purposes:

- Fetches movie location data from the San Francisco Government API
- Geocodes movie locations using Nominatim for precise geographical mapping

You might want to run this script independently to:

- Refresh or update the movie locations dataset
- Perform additional data processing
- Investigate geocoding results
- Use as a standalone data retrieval tool

3. Run the Python script
   ```bash
   python geocode_movies.py
   ```

## Environment Variables

Refer to `.env.example` for required configuration:

- `API_TOKEN`: API token for San Francisco Open Data Portal

## Live Demo

You can view the live application at the following link:

[Deployed Application](https://vaibhav-28.github.io/sf-movies/)
