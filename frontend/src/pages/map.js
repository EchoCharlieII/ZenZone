import React, {useState, useEffect} from "react";
import MyMap from '../components/MyMap';
import DateSelector from "../components/DateSelector/DateSelector";

// Importing the component for the loading screen
//import Loading from "../components/PageLoading/loading";

// Holding the data sent from the backend, initially set to an empty array


 
const Map = () => {



    // Holding the data sent from the backend, initially set to an empty array
    const [mapData, setMapData] = useState([]);



    const [mode, setMode] = useState('prediction'); // 'prediction' or 'route'
















    
    return (
        <div>
            <h1>Please Select An Option Below</h1>
            <button onClick={() => setMode('prediction')}>Busyness Prediction</button>
            <button onClick={() => setMode('route')}>Route Planner</button>
            {mode === 'prediction' ? (
                <>
                    <h1>Prediction Mode</h1>
                    <MyMap mapData={mapData} />
                    <DateSelector onDateSubmit={setMapData} />
                </>
            ) : (
                <>
                    <h1>Routing Mode</h1>
                    <MyMap mapData={mapData} />
                </>
            )}
        </div>
    );
};
 
export default Map;