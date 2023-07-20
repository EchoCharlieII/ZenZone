import React from 'react';
import ApiService from '../../services/ApiService';

const SubmitButton = ({ selectedDate }) => {
    const handleSubmit = () => {
      if (selectedDate) {
        ApiService.submitDate(selectedDate)
          .then((response) => {
            // Handle the response from the backend
            // console.log('Response:', response);
            // Add any further actions or state updates here
          })
          .catch((error) => {
            // Handle any errors
            // console.error('Error:', error);
          });
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