import React, { useState, useEffect } from "react";
import MyMap from "../components/MyMap";
import Sidebar from "../components/Sidebar";
import ApiService from '../services/ApiService';
import "./Map.css";


// Importing the component for the loading screen
//import Loading from "../components/PageLoading/loading";

// Holding the data sent from the backend, initially set to an empty array

export default function Map() {
  // Holding the data sent from the backend, initially set to an empty array
  const [mapData, setMapData] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // useEffect(() => {
  //   // This code runs after the component is mounted
  //   ApiService.submitDate(new Date())
  //   .then((response) => {
  //       console.log("Api Response:", response.data);
  //       setMapData(response.data); // Pass the data to the parent component
  //   })
  //   .catch((error) => {
  //       console.error("Error:", error);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [route, setRoute] = useState([]);

  const onLocationsSelected = (startLocation, endLocation) => {
    setRoute([startLocation, endLocation]);
  };

  return (
    <div className="container">
      <Sidebar
        onLocationsSelected={onLocationsSelected}
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        setMapData={setMapData}
      />
      <MyMap className="main-map" mapData={mapData} route={route} />
    </div>
  );
}
