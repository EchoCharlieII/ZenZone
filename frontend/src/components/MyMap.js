// This component will be used to render the map

import React, { useEffect, useState } from 'react';
import {MapContainer, TileLayer, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Importing the Loading Component
import Loading from './PageLoading/loading';


// Importing the CSV parser function
import { parseCSVData } from './csvParser';
import predictionsCSV from '../data/predictions.csv';

function MyMap() {

    // Setting the coordinates for the center of NYC
    const centerCoordinates = [40.725, -74.0060];
    const [polylines, setPolylines] = useState([]);


    // Setting the state for the Loading Screen
    const[isLoading, setLoading] = useState(true);


    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you can send the selectedDate value to the backend using JSON format
        // You can make an HTTP request or invoke a function that handles the data submission
        console.log(selectedDate);
    };



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
                    .filter(item => item.geometry && item.street_calm_rate !== undefined)
                    .map(item => ({
                        geometry: item.geometry,
                        street_calm_rate: parseFloat(item.street_calm_rate),
                    }))
                    .slice(0,30000); // Limiting the number of streets to 30000
                setPolylines(limitedPolylines);
                setLoading(false) // Set loading state to false when render is complete
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


    return (
        <div>
            {isLoading ? ( // Conditional rendering of loading screen
                <Loading />
            ) : (
                <MapContainer
            center={centerCoordinates}
            zoom={13}
            style={{minHeight: '400px', width:'100%'}}
        >
            {/* I'm not too sure what this part is useful for yet */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            />


            {polylines.map((lineString, index) => (
                <Polyline
                    key={index}
                    positions={parseLineStringCoordinates(lineString.geometry)}
                    color={getLineColour(lineString.street_calm_rate)} // Set to color of the polyline
                />
            ))}


            {/* Date Selection Form */}
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Select a date:
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
                </label>
                    <button type="submit">Submit</button>
            </form>
        </div>

        </MapContainer>
            )}
        </div>

    );
}

// Helper function to parse LINESTRING coordinates
function parseLineStringCoordinates(lineString) {
    try {
      const coordinateString = lineString.replace('LINESTRING (', '').replace(')', '');
      const coordinates = coordinateString.split(',').map(coord => {
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