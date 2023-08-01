import React, {useState, useEffect} from "react";
import MyMap from '../components/MyMap';


 
const MapRoute = () => {


    // Holding the data sent from the backend, initially set to an empty array
    const [mapData, setMapData] = useState([]);






    return (
        <div>
            <h1>
                This is the page for the Routing Function.
            </h1>
        <MyMap mapData={mapData}/>
        </div>
    );
};
 
export default MapRoute;