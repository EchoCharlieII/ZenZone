import React, { useState } from 'react';

function TimeInput({ onValueChange }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    const newValue = event.target.value;
    if (newValue === '' || /^[1-9]\d*$/.test(newValue)) {
      setValue(newValue);
      if (typeof onValueChange === 'function') {
        onValueChange(parseInt(newValue, 10));
      }
    }
    else {
      alert("Please enter a positive integer.");
    }
  };

  return (
    <input
      type="number"
      min="1"
      value={value}
      onChange={handleChange}
      placeholder="Enter the time"
    />
  );
}

export default TimeInput;
