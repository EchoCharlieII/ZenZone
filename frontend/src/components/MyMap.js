import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import Loading from './PageLoading/loading';






function MyMap({ mapData }) {

  // Setting the Center Coordinates for New York City
  const centerCoordinates = [40.725, -74.0060];
  //const [isLoading, setLoading] = useState(true);

  console.log("Received Map Data:", mapData);






  
  

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
          
        </MapContainer>
      {/*})} */}
    </div>
  );
}

export default MyMap;