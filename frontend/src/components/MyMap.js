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
    const brightnessFactor = 0.95;  // Reduce brightness to get darker colors. You can adjust this as needed.
    let red = 0;
    let green = 0;
    const blue = 0;
    
    // Apply a square function to adjust the rate to fit a bell curve distribution
    const adjustedRate = streetCalmRate <= 0.5 ? Math.pow(streetCalmRate * 2, 2) / 2 : 1 - Math.pow((1 - streetCalmRate) * 2, 2) / 2;

    if (adjustedRate <= 0.5) {
        // transition from red to yellow
        red = Math.round(255 * brightnessFactor);
        green = Math.round(255 * (adjustedRate / 0.5) * brightnessFactor);
    } else {
        // transition from yellow to green
        red = Math.round(255 * ((1 - adjustedRate) / 0.5) * brightnessFactor);
        green = Math.round(255 * brightnessFactor);
    }

    return `rgb(${red}, ${green}, ${blue})`;
};



  // Limit the number of objects to render on the map (80,000 in this case)
  const limitedMapData = mapData.slice(0, 80000);
  
  

  // State for loading screen
  const [isLoading, setIsLoading] = useState(true);

  //hide loading screen
  if (document.getElementById('loading-screen')) {
    document.getElementById('loading-screen').style.display = 'none';
  }

  // key so that new map is generated
  const keyData = JSON.stringify(mapData).substr(0, 1000);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div id="loading-screen"></div>
      <MapContainer
        center={centerCoordinates}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        key={keyData}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        />
        <Polyline positions={limitedMapData} color="blue" />

        {/* {limitedMapData.map((item, index) => {
          const coordinates = parseCoordinates(item.geometry);
          const streetCalmRate = item.street_calm_rate;
          const color = getColor(streetCalmRate);

          return <Polyline key={index} positions={coordinates} color={color} />;
        })} */}

      </MapContainer>
    </div>
  );
}
