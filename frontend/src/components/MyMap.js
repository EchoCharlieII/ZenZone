import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "./PageLoading/loading";
import L from 'leaflet';
import markerIcon from "./google-309740_1280.webp";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './MyMap.css';


export default function MyMap({ mapData, route }) {
  // Log the mapData prop for debugging
  console.log("mapData prop in MyMap component:", mapData);

  // Setting the Center Coordinates for New York City
  const centerCoordinates = [40.7899, -73.9524];
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
  
  // New state variable for polyline visibility
  const [showPolylines, setShowPolylines] = useState(true);

  // State for loading screen
  const [isLoading, setIsLoading] = useState(true);

  //hide loading screen
  if (document.getElementById('loading-screen')) {
    document.getElementById('loading-screen').style.display = 'none';
  }

  // key so that new map is generated
  const keyData = JSON.stringify(mapData).substr(0, 1000);

  // New function for fetching quiet places data
  const fetchQuietPlacesData = async (placeTypes) => {  
    try {
      const requests = placeTypes.map(placeType => fetch(`http://localhost:8000/map-api/quiet-place-info?place=${placeType}`));
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      });

      const data = await Promise.all(responses.map(response => response.json()));
      console.log('Data fetched from API:', data);

      // Merge the data from both API calls into a single array
      const mergedData = data.reduce((acc, cur) => {
        return {
          ...acc,
          results: [...acc.results, ...cur.results]
        };
      }, { results: [] });

      setQuietPlacesData(mergedData);
    } catch (error) {
      console.log('Fetching quiet places data failed:', error);
    }
  };

  const customMarkerIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [20, 30], // size of the icon
    iconAnchor: [10, 30], // point of the icon which will correspond to marker's location = bottom of pin
    popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
  });

  const MANHATTAN_BOUNDS = {
    LAT_MIN: 40.7000,
    LAT_MAX: 40.8821,
    LON_MIN: -74.0479,
    LON_MAX: -73.9067
  };

  const renderMarkers = () => {
    if (!quietPlacesData.results || !Array.isArray(quietPlacesData.results)) {
      return null;
    }

    // Array of coordinates to be excluded
    const excludeCoordinates = [
      { latitude: 40.7455046393787, longitude: -73.9587663716889 },
      { latitude: 40.756377, longitude: -73.923855 },
      { latitude: 40.7165546631842, longitude: -73.9597964066005 },
      { latitude: 40.7142079238412, longitude: -73.9617848396301 },
      { latitude: 40.707248, longitude: -73.95375 }
    ];
  
    return quietPlacesData.results
      .filter(place => {
        const { latitude, longitude } = place.coordinates;
        const isExcluded = excludeCoordinates.some(coord => 
          coord.latitude === latitude && coord.longitude === longitude
        );
        return (
          latitude > MANHATTAN_BOUNDS.LAT_MIN &&
          latitude < MANHATTAN_BOUNDS.LAT_MAX &&
          longitude > MANHATTAN_BOUNDS.LON_MIN &&
          longitude < MANHATTAN_BOUNDS.LON_MAX &&
          !isExcluded
        );
      })
      .map((place, index) => {
        const { latitude, longitude } = place.coordinates;
        return (
          <Marker key={index} position={[latitude, longitude]} icon={customMarkerIcon}>
            <Popup>
              <h3>{place.name}</h3>
              <p><strong>Status:</strong> {place.is_closed ? "Closed" : "Open"}</p>
              <p><strong>Rating:</strong> {place.rating}</p>
              <p><strong>Review Count:</strong> {place.review_count}</p>
              <p><strong>Location:</strong> {place.location.address1}</p>
              <p><strong>Phone:</strong> {place.phone}</p>
              <p><strong>Price:</strong> {place.price ? place.price : "N/A"}</p>
            </Popup>
          </Marker>
        );
      });
  };


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="button-container" style={{ position: 'absolute', zIndex: 1000, padding: '10px' }}>
        
        <button className="button" style={{ backgroundColor: 'rgb(249, 249, 249)', borderRadius: '8px' }} onClick={() => { fetchQuietPlacesData(['cafe']); }}>Cozy Cafes</button>


        <button className="button" style={{ backgroundColor: 'rgb(249, 249, 249)', borderRadius: '8px' }} onClick={() => { fetchQuietPlacesData(['library']); }}>Quiet Libraries</button>

        <button className="button" style={{ backgroundColor: 'rgb(249, 249, 249)', borderRadius: '8px' }} onClick={() => { fetchQuietPlacesData(['museum']); }}>Timeless Museums</button>

        <button className="button" style={{ backgroundColor: 'rgb(249, 249, 249)', borderRadius: '8px' }} onClick={() => { fetchQuietPlacesData(['read_place']); }}>Reading Spots</button>

        <button className="button" style={{ backgroundColor: 'rgb(249, 249, 249)', borderRadius: '8px' }} onClick={() => { fetchQuietPlacesData(['study_place']); }}>Study Spaces</button>

        <button className="button" style={{ backgroundColor: 'rgb(249, 249, 249)', borderRadius: '8px' }} onClick={() => { setQuietPlacesData({ results: [] });  fetchQuietPlacesData(['secret_spot', 'secluded_spot']); }}>Hidden Gems</button>

      </div>

      <div className="heatmap-toggle">
        <Tooltip title="Show/Hide Heatmap">
          <div className="icon-button-wrapper">
            <IconButton
              onClick={() => setShowPolylines(!showPolylines)}
            >
              {showPolylines ? 
                <VisibilityIcon style={{ color: "black" }} /> :
                <VisibilityOffIcon style={{ color: "black" }} />
              }
            </IconButton>
          </div>
        </Tooltip>
      </div>

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

        {renderMarkers()}

        {showPolylines && limitedMapData.map((item, index) => {
          const coordinates = parseCoordinates(item.geometry);
          const streetCalmRate = item.street_calm_rate;
          const color = getColor(streetCalmRate);

          return <Polyline key={index} positions={coordinates} color={color} />;
        })}
      </MapContainer>
    </div>
  );
}
