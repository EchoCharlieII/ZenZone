import React, {useState} from "react";
import MyMap from '../components/MyMap';
import CustomDatePicker from '../components/ZonePrediction/CustomDatePicker';
import SubmitButton from "../components/ZonePrediction/SubmitButton";

 
const Map = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        console.log('Selected Date:', date);
    };

    const handleFormSubmit = () => {
        // Perform any additional logic or API submission using selectedDate
        console.log('Selected Date:', selectedDate);
        // Clear the selected date after submission if needed
        setSelectedDate(null);
    };

    return (
        <div>
            <h1>
                This is the page for the Map.
            </h1>
            <CustomDatePicker onDateChange={handleDateChange} />
            <SubmitButton selectedDate={selectedDate} onSubmit={handleFormSubmit} />
            <h1>Just To break things up a little</h1>
            <MyMap />
        </div>
    );
};
 
export default Map;