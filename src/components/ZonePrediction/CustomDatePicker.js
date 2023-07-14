import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({onDateChange}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date); // Call the onDateChange prop
  };

  return (
    <div>
      <h2>Select a Date:</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
      />
      <p>Selected Date: {selectedDate ? selectedDate.toISOString().slice(0, 10) : 'None'}</p>
    </div>
  );
};

export default CustomDatePicker;