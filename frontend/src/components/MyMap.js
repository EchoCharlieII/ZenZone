import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Loading from './PageLoading/loading';






function MyMap({ mapData }) {

  // Setting the Center Coordinates for New York City
  const centerCoordinates = [40.725, -74.0060];
  //const [isLoading, setLoading] = useState(true);

  console.log("Received Map Data:", mapData);





  // The following are all functions to render the lines on the map based on the user date input



  // Function to parse the LINESTRING coordinates
  const parseCoordinates = (lineString) => {
    // Assuming lineString is in the format: 'LINESTRING (lon1 lat1, lon2 lat2, ...)'
    const coordinatesString = lineString.replace('LINESTRING (', '').replace(')', '');
    const coordinatesArray = coordinatesString.split(',').map((coord) => {
      const [lon, lat] = coord.trim().split(' ');
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





  // The following will be the code that will allow the user to drag markers onto the screen


  // State to store starting and ending coordinates
  const [startingCoordinate, setStartingCoordinate] = useState([40.7128, -74.0060]);
  const [endingCoordinate, setEndingCoordinate] = useState([41.7128, -74.0060]);

  // Function to handle marker dragging
  const handleMarkerDragEnd = (markerType, event) => {
    const { lat, lng } = event.target.getLatLng();
    if (markerType === 'starting') {
      setStartingCoordinate([lat, lng]);
    } else if (markerType === 'ending') {
      setEndingCoordinate([lat, lng]);
    }
  };






  
  
  return (
    <div>
      {/*{isLoading ? (
        <Loading />
      ) : (*/}
      
        <MapContainer
          center={centerCoordinates}
          zoom={13}
          style={{ minHeight: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
          />

          {/* Render Starting Marker */}
          {startingCoordinate && (
            <Marker position={startingCoordinate} draggable onDragEnd={(e) => handleMarkerDragEnd('starting', e)}>
            <Popup>Starting Point</Popup>
          </Marker>
          )}

          {/* Render Ending Marker */}
          {endingCoordinate && (
            <Marker position={endingCoordinate} draggable onDragEnd={(e) => handleMarkerDragEnd('ending', e)}>
            <Popup>Ending Point</Popup>
            </Marker>
          )}







          {limitedMapData.map((item, index) => {
            const coordinates = parseCoordinates(item.geometry);
            const streetCalmRate = item.street_calm_rate;
            const color = getColor(streetCalmRate);

            
            return <Polyline key={index} positions={coordinates} color={color} />;
          })}
          
        </MapContainer>
      {/*})} */}
    </div>
  );
}

export default MyMap;