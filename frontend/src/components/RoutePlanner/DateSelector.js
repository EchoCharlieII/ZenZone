import React, { useState } from 'react';
import CustomDatePicker from './CustomDatePicker';
import SubmitButton from './SubmitButton';
import ApiService from '../../services/ApiService';
import './DateSelector.css';


export default function DateSelector({ onDateSubmit, startLocation, endLocation , mode}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [mapData, setMapData] = useState([]);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  const handleSubmit = () => {
    if (selectedDate && startLocation && endLocation && mode) {
      ApiService.renderBestRoute(selectedDate, startLocation, endLocation, mode)
        .then((response) => {
          console.log("Api Response:", response.data.path);
          setMapData(response.data.path); // Set received data to the state variable
          onDateSubmit(response.data.path); // Pass the data to the parent component
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
      <SubmitButton onSubmit={handleSubmit} selectedDate={selectedDate} />
    </div>
  );
}
