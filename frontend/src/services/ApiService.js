

import axios from 'axios';


const ApiService = {

    submitDate: async (date) => {
        try {
            // show loading screen
            if (document.getElementById('loading-screen')) {
              document.getElementById('loading-screen').style.display = 'block';
            }
            //document.getElementById('loading-screen').style.display = 'block';
            // Generating the POST request to the backend
            const response = await axios.post('http://localhost:8000/map-api/render-map', { date });
              console.log("Data:", response.data);

              const firstObject = response.data[0];

              console.log("First Object:", JSON.stringify(firstObject));

              return response;
          } catch (error) {
            if (document.getElementById('loading-screen')) {
              document.getElementById('loading-screen').style.display = 'none';
            }
            // Handle any errors
            console.error('Error:', error);
            throw error;
          }
    },
};
      
export default ApiService;