import React, {useState, useEffect} from "react";
import MyMap from '../components/MyMap';
import Sidebar from '../components/Sidebar';
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

    return (
        <div className="container">
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
            <MyMap className="main-map" mapData={mapData}/>
        </div>
    );
};
 
export default Map;