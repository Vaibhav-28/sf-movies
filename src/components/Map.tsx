import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Movie } from "../types/movie";
import MarkerClusterGroup from "react-leaflet-cluster";

interface MapProps {
  movies: Movie[];
}

const Map = ({ movies }: MapProps) => {
  const position: [number, number] = [37.7749, -122.4194];
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
      preferCanvas={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {movies.map((movie, index) => (
          <Marker
            key={index}
            position={[parseFloat(movie.lat), parseFloat(movie.lng)]}
          >
            <Popup>
              <b>{movie.title}</b> <br />
              Actor 1: {movie.actor_1 || "No data"} <br />
              Actor 2: {movie.actor_2 || "No data"} <br />
              Actor 3: {movie.actor_3 || "No data"} <br />
              Director: {movie.director || "No data"} <br />
              Distributor: {movie.distributor || "No data"} <br />
              Locations: {movie.locations || "No data"} <br />
              Production company: {movie.production_company || "No data"} <br />
              Release Year: {movie.release_year || "No data"} <br />
              writer: {movie.writer || "No data"} <br />
              {movie.locations}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
export default Map;
