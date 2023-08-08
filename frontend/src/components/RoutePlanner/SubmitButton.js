import React from "react";
import "./DateSelector.css";

export default function SubmitButton({ selectedDate, onSubmit }) {
  const handleSubmit = () => {
    if (selectedDate) {
      onSubmit(selectedDate); // Call the onSubmit function passed by the parent component
    } else {
      alert("No date selected.");
    }
  };

  return <button class="sidebar-submit" onClick={handleSubmit}>Submit</button>;
}
