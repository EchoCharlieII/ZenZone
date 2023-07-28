import React, {useState, useEffect} from "react";
import MyMap from '../components/MyMap';
import DateSelector from "../components/DateSelector/DateSelector";

// Importing the component for the loading screen
//import Loading from "../components/PageLoading/loading";

// Holding the data sent from the backend, initially set to an empty array


 
const Map = () => {



    // Holding the data sent from the backend, initially set to an empty array
    const [mapData, setMapData] = useState([]);















    
    return (
        <div>
            <h1>This is the page for the Map.</h1>
            <MyMap mapData={mapData}/>
            <h1>nada</h1>
            <h1>nada</h1>
            <DateSelector onDateSubmit={setMapData}/>
        </div>
    );
};
 
export default Map;