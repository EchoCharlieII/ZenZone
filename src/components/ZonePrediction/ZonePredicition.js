import React, { useState } from 'react';
import CustomDatePicker from './ZonePrediction/CustomDatePicker';
import SubmitButton from './ZonePrediction/SubmitButton';

const ZonePrediction = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFormSubmit = () => {
    // Perform any additional logic or API submission using selectedDate
    console.log('Selected Date:', selectedDate);
  };

  return (
    <div>
      <CustomDatePicker onDateChange={handleDateChange} />
      <SubmitButton selectedDate={selectedDate} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default ZonePrediction;