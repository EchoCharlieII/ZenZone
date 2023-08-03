import React, { useState } from "react";
// Datepicker is a third party library which allows the user a date selection interface
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateSelector.css";

export default function CustomDatePicker({ onDateChange }) {
  // The selectedDate can be changed, therefore we need to use useState
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date); // Call the onDateChange prop
  };

  return (
    <div>
      <p style={{ fontSize: "16px" }}>Select a Date:</p>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd h:mm aa"
        timeCaption="time"
      />
    </div>
  );
}
