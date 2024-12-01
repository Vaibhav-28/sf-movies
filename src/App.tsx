import "./App.css";
import Map from "./components/Map";
import { useCallback, useEffect, useState } from "react";
import { Movie } from "./types/movie";
import geocodedMovies from "./data/geocodedMovies.json";

function App() {
  const movies = geocodedMovies as Movie[];

  const [titleFilter, setTitleFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");

  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [yearSuggestions, setYearSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);

  const generateSuggestions = (
    type: "title" | "year" | "location",
    input: string
  ) => {
    if (!input) {
      if (type === "title") setTitleSuggestions([]);
      if (type === "year") setYearSuggestions([]);
      if (type === "location") setLocationSuggestions([]);
      return;
    }

    const lowerInput = input.toLowerCase();
    const uniqueSuggestions = new Set<string>();

    movies.forEach((movie) => {
      let value: string;
      switch (type) {
        case "title":
          value = movie.title;
          break;
        case "year":
          value = movie.release_year.toString();
          break;
        case "location":
          value = movie.locations;
          break;
      }

      if (value?.toLowerCase().includes(lowerInput)) {
        uniqueSuggestions.add(value);
      }
    });

    const suggestionArray = Array.from(uniqueSuggestions).slice(0, 5);

    switch (type) {
      case "title":
        setTitleSuggestions(suggestionArray);
        break;
      case "year":
        setYearSuggestions(suggestionArray);
        break;
      case "location":
        setLocationSuggestions(suggestionArray);
        break;
    }
  };

  const handleFilterChange = useCallback(() => {
    const results = movies.filter((movie) => {
      const matchesTitle =
        titleFilter === "" ||
        movie?.title?.toLowerCase().includes(titleFilter.toLowerCase());

      const matchesYear =
        yearFilter === "" ||
        movie?.release_year?.toString().includes(yearFilter);

      const matchesLocation =
        locationFilter === "" ||
        movie?.locations?.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesTitle && matchesYear && matchesLocation;
    });

    setFilteredMovies(results);
  }, [locationFilter, movies, titleFilter, yearFilter]);

  useEffect(() => {
    handleFilterChange();
  }, [titleFilter, yearFilter, locationFilter, handleFilterChange]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitleFilter(value);
    generateSuggestions("title", value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearFilter(value);
    generateSuggestions("year", value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationFilter(value);
    generateSuggestions("location", value);
  };

  const handleTitleSuggestionSelect = (suggestion: string) => {
    setTitleFilter(suggestion);
    setTitleSuggestions([]);
  };

  const handleYearSuggestionSelect = (suggestion: string) => {
    setYearFilter(suggestion);
    setYearSuggestions([]);
  };

  const handleLocationSuggestionSelect = (suggestion: string) => {
    setLocationFilter(suggestion);
    setLocationSuggestions([]);
  };

  const handleResetFilters = () => {
    setTitleFilter("");
    setYearFilter("");
    setLocationFilter("");
    setTitleSuggestions([]);
    setYearSuggestions([]);
    setLocationSuggestions([]);
  };

  return (
    <>
      <div className="movie-location-filter">
        <div className="filter-container">
          <div className="filter-row">
            <div className="filter-with-suggestions">
              <input
                type="text"
                placeholder="Filter by Title"
                value={titleFilter}
                onChange={handleTitleChange}
                className="filter-input"
              />
              {titleSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {titleSuggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      onClick={() => handleTitleSuggestionSelect(suggestion)}
                      className="suggestion-item"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="filter-with-suggestions">
              <input
                type="text"
                placeholder="Filter by Year"
                value={yearFilter}
                onChange={handleYearChange}
                className="filter-input"
              />
              {yearSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {yearSuggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      onClick={() => handleYearSuggestionSelect(suggestion)}
                      className="suggestion-item"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="filter-with-suggestions">
              <input
                type="text"
                placeholder="Filter by Location"
                value={locationFilter}
                onChange={handleLocationChange}
                className="filter-input"
              />
              {locationSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {locationSuggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      onClick={() => handleLocationSuggestionSelect(suggestion)}
                      className="suggestion-item"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="filter-actions">
            <div className="results-count">
              {filteredMovies.length} movie
              {filteredMovies.length !== 1 ? "s" : ""} found
            </div>
            <button onClick={handleResetFilters} className="reset-filter-btn">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      <Map movies={filteredMovies} />
    </>
  );
}

export default App;
