import React, { useState } from 'react';
import CustomDatePicker from './CustomDatePicker';
import SubmitButton from './SubmitButton';
import ApiService from '../../services/ApiService';
import './DateSelector.css';


export default function DateSelector({ onDateSubmit, startLocation, endLocation , mode}) {
  const [mapData, setMapData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);
  const [distance, setDistance] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  const handleSubmit = () => {
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
  };
  return (
    <div>
      <CustomDatePicker onDateChange={handleDateChange} />
      <br />
      <p style={{fontFamily: "initial", fontSize: 3}}>{time ? "Time Spent: " + time["hour"] +" hour(s) and "+ time["minute"] +" minute(s)" : ""}</p>
      <p style={{fontFamily: "initial", fontSize: 3}}>{distance ? "Distance: " + distance["km"] + "." + distance["meter"] + " km" : ""}</p>
      <br />
      <SubmitButton onSubmit={handleSubmit} selectedDate={selectedDate} />
    </div>
  );
}
