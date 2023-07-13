import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';


const ZoomLevelHandler = () => {
    const map = useMap();
    const [currentZoomLevel, setCurrentZoomLevel] = useState(map.getZoom());

    useEffect(() => {
        const handleZoomChange = () => {
            const newZoomLevel = map.getZoom();
            setCurrentZoomLevel(newZoomLevel);
            // Call a custom function to handle the logic based on the new zoom level
            handleCustomLogic(newZoomLevel);
        };

        map.on('zoomend', handleZoomChange);

        return () => {
            map.off('zoomend', handleZoomChange);
        };
    }, [map]);


    const handleCustomLogic = (zoomLevel) => {
        // Implement your custom logic based on the zoom level
        if (zoomLevel > 10) {
            // Render Lines
            // Add your logic to render lines on the map based on the zoom level

        } else {
            // Remove Lines
            // Add your logic to remove lines from the map
        }
    };

    return null; // This component doesn't render anything, it only handles the logic
};