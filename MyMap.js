import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importing the CSV parser function
import { parseCSVData } from './csvParser';
import predictionsCSV from '../data/test2.csv';



//40.737881762653174, -73.98123336367267
//40.74207080600518, -73.98126972136383
function MyMap() {
  // Setting the coordinates for the center of NYC
  const centerCoordinates = [40.725326, -74.0060];
  const [polylines, setPolylines] = useState([]);
  const [startLat, setStartLat] = useState('40.737881762653174');
  const [startLon, setStartLon] = useState('-73.98123336367267');
  const [destLat, setDestLat] = useState('40.74207080600518');
  const [destLon, setDestLon] = useState('-73.98126972136383');
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(predictionsCSV);
        const csvData = await response.text();
        const parsedData = await parseCSVData(csvData);
        
        // Process the parsed CSV data
        console.log(parsedData);
        // Update the polylines state with the LINESTRING coordinates
        const limitedPolylines = parsedData
          .filter((item) => item.geometry && item.street_calm_rate !== undefined)
          .map((item) => ({
            geometry: item.geometry,
            street_calm_rate: parseFloat(item.street_calm_rate),
          }))
          .slice(0, 50000); // Limiting the number of streets to 500
        setPolylines(limitedPolylines);
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    };

    fetchData();
  }, []);

  const getLineColour = (streetCalmRate) => {
    // Calculate the colour of the street based on the calm rate
    const red = Math.round(255 * (1 - streetCalmRate));
    const green = Math.round(255 * streetCalmRate);
    return `rgb(${red}, ${green}, 0)`;
  };

  const getLocation = async () => {
    const startLatValue = parseFloat(startLat);
    const startLonValue = parseFloat(startLon);
    const destLatValue = parseFloat(destLat);
    const destLonValue = parseFloat(destLon);
  
    if (
      isNaN(startLatValue) ||
      isNaN(startLonValue) ||
      isNaN(destLatValue) ||
      isNaN(destLonValue)
    ) {
      alert('Invalid coordinates. Please enter valid numerical values.');
      return;
    }
  
    try {
      // Plan the route using Mapbox Directions API
      const route = await planRoute(startLatValue, startLonValue, destLatValue, destLonValue);
      setRouteCoordinates(route.coordinates);
      console.log('Route successfully fetched:', route);
    } catch (error) {
      console.error('Error planning route:', error);
      alert('Error planning route. Please try again later.');
    }
  };
  

  const planRoute = async (startLat, startLon, destLat, destLon) => {
    try {
      // Best path coordinates
      const bestPath = [
        [40.738483550046595, -73.9918239696857],
        [40.737814920161256, -73.99014758915811],
        [40.738489646949496, -73.98994642345669],
        [40.739184689682205, -73.98975866882343],
        [40.738327062821, -73.98774164761427],
        [40.74017846623924, -73.9863629922245],
        [40.739672434640546, -73.98518550254194]
      ];
  
      // Convert the best path coordinates to Leaflet LatLng objects
      const routeCoordinates = bestPath.map(([lat, lng]) => [lat, lng]);
  
      return { coordinates: routeCoordinates, color: 'blue' };
    } catch (error) {
      throw error;
    }
  };
  
  

  return (
    <div>
      <div>
        <label>
          Start Latitude:
          <input
            type="text"
            value={startLat}
            onChange={(e) => setStartLat(e.target.value)}
          />
        </label>
        <label>
          Start Longitude:
          <input
            type="text"
            value={startLon}
            onChange={(e) => setStartLon(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Destination Latitude:
          <input
            type="text"
            value={destLat}
            onChange={(e) => setDestLat(e.target.value)}
          />
        </label>
        <label>
          Destination Longitude:
          <input
            type="text"
            value={destLon}
            onChange={(e) => setDestLon(e.target.value)}
          />
        </label>
      </div>
      <button onClick={getLocation}>Get Location</button>

      <MapContainer
        center={centerCoordinates}
        zoom={13}
        style={{ height: '800px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        />
        {polylines.map((lineString, index) => (
          <Polyline
            key={index}
            positions={parseLineStringCoordinates(lineString.geometry)}
            color={getLineColour(lineString.street_calm_rate)}
          />
        ))}

        {/* Display the planned route */}
        <Polyline positions={routeCoordinates} color="blue" />

        {/* Display start and destination markers */}
        {startLat && startLon && (
          <Marker
            position={[startLat, startLon]}
            icon={L.divIcon({ className: 'start-marker' })}
          />
        )}
        {destLat && destLon && (
          <Marker
            position={[destLat, destLon]}
            icon={L.divIcon({ className: 'dest-marker' })}
          />
        )}
      </MapContainer>
    </div>
  );
}

// Helper function to parse LINESTRING coordinates
function parseLineStringCoordinates(lineString) {
  try {
    const coordinateString = lineString.replace('LINESTRING (', '').replace(')', '');
    const coordinates = coordinateString.split(',').map((coord) => {
      const [lng, lat] = coord.trim().split(' ');
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        throw new Error('Invalid coordinates');
      }
      return [parsedLat, parsedLng];
    });
    return coordinates;
  } catch (error) {
    console.error('Error parsing LINESTRING coordinates:', error);
    return [];
  }
}

export default MyMap;

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Polygon, Polyline, Marker } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const centerCoordinates = [40.725326, -74.0060];
// const taxiZones = [
//   // Taxi zone data (latitude, longitude, and calm rates for each zone)
//   {
//     zoneCoordinates: [
//       [40.725326, -73.976212],
//       [40.725399, -73.97616],
//       [40.725594, -73.975854]
//     ],
//     streetCalmRates: [0.2, 0.7, 0.4]
//   },
//   // Add more taxi zones here with their respective coordinates and calm rates
// ];

// const getHeatmapColor = (value) => {
//   // Heatmap color gradient (adjust the colors as needed)
//   const heatmapColors = [
//     [0, 'rgb(0, 255, 0)'],     // Green for lowest calm rate
//     [0.5, 'rgb(255, 255, 0)'], // Yellow for medium calm rate
//     [1, 'rgb(255, 0, 0)']      // Red for highest calm rate
//   ];

//   // Interpolate the color based on the calm rate value
//   for (let i = 1; i < heatmapColors.length; i++) {
//     const [val, color] = heatmapColors[i];
//     if (value <= val) {
//       const [prevVal, prevColor] = heatmapColors[i - 1];
//       const t = (value - prevVal) / (val - prevVal);
//       const [r1, g1, b1] = prevColor.match(/\d+/g);
//       const [r2, g2, b2] = color.match(/\d+/g);
//       const r = Math.round(parseInt(r1) * (1 - t) + parseInt(r2) * t);
//       const g = Math.round(parseInt(g1) * (1 - t) + parseInt(g2) * t);
//       const b = Math.round(parseInt(b1) * (1 - t) + parseInt(b2) * t);
//       return `rgb(${r}, ${g}, ${b})`;
//     }
//   }

//   return heatmapColors[heatmapColors.length - 1][1];
// };

// function MyMap() {
//   const [zoomLevel, setZoomLevel] = useState(13);
//   const [showHeatmap, setShowHeatmap] = useState(true);

//   useEffect(() => {
//     const handleZoomChange = (e) => {
//       setZoomLevel(e.target._zoom);
//       setShowHeatmap(e.target._zoom <= 13); // Show heatmap when zoom is less than or equal to 13
//     };

//     const map = L.map('map');
//     map.on('zoomend', handleZoomChange);
//   }, []);

//   return (
//     <div>
//       <MapContainer center={centerCoordinates} zoom={zoomLevel} style={{ height: '800px', width: '100%' }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors" />

//         {/* Display taxi zones */}
//         {taxiZones.map((zone, index) => (
//           showHeatmap ? (
//             // Render heatmap when zoom level is less than or equal to 13
//             <Polygon key={index} positions={zone.zoneCoordinates} color={getHeatmapColor(zone.streetCalmRates.reduce((acc, rate) => acc + rate, 0) / zone.streetCalmRates.length)} />
//           ) : (
//             // Render colorful line strings when zoom level is greater than 13
//             <Polyline key={index} positions={zone.zoneCoordinates} color="blue" />
//           )
//         ))}

//         {/* Display start and destination markers */}
//         {taxiZones.map((zone, index) => (
//           <Marker key={index} position={zone.zoneCoordinates[0]} icon={L.divIcon({ className: 'start-marker' })} />
//         ))}
//       </MapContainer>
//     </div>
//   );
// }

// export default MyMap;
