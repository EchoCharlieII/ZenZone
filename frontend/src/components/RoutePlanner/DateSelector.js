import React, { useState } from 'react';
import CustomDatePicker from './CustomDatePicker';
import SubmitButton from './SubmitButton';
import ApiService from '../../services/ApiService';
import './DateSelector.css';


export default function DateSelector({ onDateSubmit, startLocation, endLocation , mode, heatmap}) {
  const [mapData, setMapData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [distance, setDistance] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  const handleSubmit = () => {
    if(heatmap){
      if (selectedDate) {
        ApiService.submitDate(selectedDate)
          .then((response) => {
            console.log("Api Response:", response);
            setMapData(response); // Set received data to the state variable
            onDateSubmit(response); // Pass the data to the parent component
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("No date selected.")
      }
    } else {
      if (selectedDate && startLocation && endLocation && mode) {
        ApiService.renderBestRoute(selectedDate, startLocation, endLocation, mode)
          .then((response) => {
            setMapData(response.path); // Set received data to the state variable
            setTime(response.time);
            setDistance(response.distance);
            onDateSubmit(response.path); // Pass the data to the parent component
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("Please select the locations and your wanted mode.");
      }
    }
  };
  return (
    <div>
      <CustomDatePicker onDateChange={handleDateChange} currentDate={selectedDate}/>
      <SubmitButton onSubmit={handleSubmit} selectedDate={selectedDate} />
      {time && (
        <>
          <br />
          <p style={{fontFamily: "initial", fontSize: 16}}>{time ? "Time: " + time["hour"] +" hour(s) and "+ time["minute"] +" minute(s)" : ""}</p>
          <p style={{fontFamily: "initial", fontSize: 16}}>{distance ? "Distance: " + distance["km"] + "." + distance["meter"] + " km" : ""}</p>
          <br />
        </>
      )}
    </div>
  );
}
