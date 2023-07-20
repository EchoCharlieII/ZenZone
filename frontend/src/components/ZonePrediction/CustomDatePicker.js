import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({onDateChange}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date); // Call the onDateChange prop
  };

  const formatSelectedDate = (date) => {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      return startOfDay.toISOString().slice(0, 10);
    }
    return 'None';
  };

  return (
    <div>
      <h2>Select a Date:</h2>
      <DatePicker
        selected={selectedDate} 
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
      />
      <p>Selected Date: {formatSelectedDate(selectedDate)}</p>
    </div>
  );
};

export default CustomDatePicker;