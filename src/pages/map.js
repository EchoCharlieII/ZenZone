import React from "react";
import MyMap from '../components/MyMap';
import CustomDatePicker from '../components/ZonePrediction/CustomDatePicker';


 
const Map = () => {
    return (
        <div>
            <h1>
                This is the page for the Map.
            </h1>
        <CustomDatePicker />
        <MyMap />
        </div>
        
    );
};
 
export default Map;