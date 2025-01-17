import React, { useState } from "react";

export default function ModeSelectMenu({ onSelectionChange }) {
  const [value, setValue] = useState("balance");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onSelectionChange(newValue);
  };

  return (
    <div>
      <select value={value} onChange={handleChange}>
        <option value="balance">Balance mode</option>
        <option value="distance">I want to walk faster</option>
        <option value="calm">I want to walk calmer</option>
      </select>
    </div>
  );
}
