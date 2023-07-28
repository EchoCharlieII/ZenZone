import React from 'react';

const SubmitButton = ({ selectedDate, onSubmit }) => {
  const handleSubmit = () => {
    if (selectedDate) {
      onSubmit(selectedDate); // Call the onSubmit function passed by the parent component
    } else {
      console.log('No date selected');
    }
  };

  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  );
};

export default SubmitButton;