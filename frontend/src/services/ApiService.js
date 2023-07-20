// This is where the information about the backend server will be held
// At the moment, it just contains placeholder values

// We are using Axios as the library to make HTTP requests to the Backend
import axios from 'axios';



const ApiService = {
    submitDate: async (date) => {
        try {
            // Generating the POST request to the backend
            const response = await axios.post('http://localhost:8000/predict-api/dummy_test', { date });
            // Handle the response from the backend
            console.log('Response:', response.data);
            return response.data;
          } catch (error) {
            // Handle any errors
            console.error('Error:', error);
            throw error;
          }
    },
};
      
export default ApiService;