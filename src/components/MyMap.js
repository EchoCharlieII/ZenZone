// This component will be used to render the map

import React from 'react';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MyMap() {

    // Setting the coordinates for the center of NYC
    const centerCoordinates = [40.725, -74.0060];

    return (
        <MapContainer
            center={centerCoordinates}
            zoom={13}
            style={{height: '400px', width:'100%'}}
        >
            {/* I'm not too sure what this part is useful for yet */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            />
            {/*Add markers or other map layers here*/}

        </MapContainer>

    );
}

export default MyMap;