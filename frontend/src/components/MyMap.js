import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "./PageLoading/loading";

export default function MyMap({ mapData, route }) {
  // Log the mapData prop for debugging
  console.log("mapData prop in MyMap component:", mapData);

  // Setting the Center Coordinates for New York City
  const centerCoordinates = [40.7484, -73.9857];
  //const [isLoading, setLoading] = useState(true);

  console.log("Received Map Data:", mapData);

  // Function to parse the LINESTRING coordinates
  const parseCoordinates = (lineString) => {
    // Assuming lineString is in the format: 'LINESTRING (lon1 lat1, lon2 lat2, ...)'
    const coordinatesString = lineString
      .replace("LINESTRING (", "")
      .replace(")", "");
    const coordinatesArray = coordinatesString.split(",").map((coord) => {
      const [lon, lat] = coord.trim().split(" ");
      return [parseFloat(lat), parseFloat(lon)];
    });
    return coordinatesArray;
  };

  // Function to calculate the color based on street_calm_rate
  const getColor = (streetCalmRate) => {
    const red = Math.round(255 * (1 - streetCalmRate));
    const green = Math.round(255 * streetCalmRate);
    const blue = 0; // You can set this to any constant value for now
    return `rgb(${red}, ${green}, ${blue})`;
  };

  // Limit the number of objects to render on the map (80,000 in this case)
  const limitedMapData = mapData.slice(0, 80000);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={centerCoordinates}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        />
        <Polyline positions={route} color="blue" />

        {limitedMapData.map((item, index) => {
          const coordinates = parseCoordinates(item.geometry);
          const streetCalmRate = item.street_calm_rate;
          const color = getColor(streetCalmRate);

          return <Polyline key={index} positions={coordinates} color={color} />;
        })}
      </MapContainer>
    </div>
  );
}
