import React, {useState, useEffect} from "react";
import Sidebar from '../components/Sidebar';
import MyMap from '../components/MyMap';
import './Map.css';

// Importing the component for the loading screen
//import Loading from "../components/PageLoading/loading";

// Holding the data sent from the backend, initially set to an empty array
 
const Map = () => {

    // Holding the data sent from the backend, initially set to an empty array
    const [mapData, setMapData] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const [route, setRoute] = useState([]);

    const onLocationsSelected = (startLocation, endLocation) => {
        setRoute([startLocation, endLocation]);
    };

    return (
        <div className="container">
            <Sidebar onLocationsSelected={onLocationsSelected} isOpen={isSidebarOpen} toggle={toggleSidebar} setMapData={setMapData}/>
            <MyMap className="main-map" mapData={mapData} route={route} />
        </div>
    );
};
 
export default Map;