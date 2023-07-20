import React, {useState, useEffect} from "react";
import MyMap from '../components/MyMap';
import CustomDatePicker from '../components/ZonePrediction/CustomDatePicker';
import SubmitButton from "../components/ZonePrediction/SubmitButton";

// Importing the component for the loading screen
//import Loading from "../components/PageLoading/loading";

 
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

    // Here we have the code for the loading screen of the page
    //const [isLoading, setLoading] = useState(true);

    /*useEffect(() => {
        // Simulating a delay to demonstrate the loading screen
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);
    */

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