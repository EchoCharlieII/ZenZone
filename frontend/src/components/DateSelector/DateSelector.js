import React, { useState } from 'react';
import CustomDatePicker from './CustomDatePicker';
import SubmitButton from './SubmitButton';
import ApiService from '../../services/ApiService';
import './DateSelector.css';


export default function DateSelector({ onDateSubmit }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    if (selectedDate) {
      console.log(selectedDate);
      ApiService.submitDate(selectedDate)
      .then((response) => {
        console.log("Api Response:", response.data);
        onDateSubmit(response.data); // Pass the data to the parent component
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.log("No Date Selected");
  }

  };
  return (
    <div>
      <CustomDatePicker onDateChange={handleDateChange} />
      <SubmitButton onSubmit={handleSubmit} selectedDate={selectedDate} />
    </div>
  );
}
