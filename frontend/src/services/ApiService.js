

import axios from 'axios';


const ApiService = {

    submitDate: async (date) => {
        try {
            // Generating the POST request to the backend
            const response = await axios.post('http://localhost:8000/map-api/render-map', { date });
              return response;
              
          } catch (error) {
            // Handle any errors
            console.error('Error:', error);
            throw error;
          }
    },
};
      
export default ApiService;