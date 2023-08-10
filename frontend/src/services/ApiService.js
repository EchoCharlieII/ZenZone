import axios from "axios";

const ApiService = {
  renderBestRoute: async (selectedDate, startLocation, endLocation, mode) => {
    try {
      // show loading screen
      if (document.getElementById("loading-screen")) {
        document.getElementById("loading-screen").style.display = "block";
      }

      // Generating the POST request to the backend
      const response = await axios.post(
        "http://localhost:8000/map-api/best-path",
        {
          date: selectedDate,
          source: startLocation,
          target: endLocation,
          mode: mode,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (error) {
      if (document.getElementById("loading-screen")) {
        document.getElementById("loading-screen").style.display = "none";
      }
      
      console.error("Error:", error);
      throw error;
    }
  },

  circularWalking: async (date, source, duration) => {
    try {
      // show loading screen
      if (document.getElementById("loading-screen")) {
        document.getElementById("loading-screen").style.display = "block";
      }

      // Generating the POST request to the backend
      const response = await axios.post(
        "http://localhost:8000/map-api/circle-path",
        {
          "date": date,
          "source": source,
          "duration": duration,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (error) {
      if (document.getElementById("loading-screen")) {
        document.getElementById("loading-screen").style.display = "none";
      }

      console.error("Error:", error);
      throw error;
    }
  },

  submitDate: async (date) => {
    try {
      // show loading screen
      if (document.getElementById("loading-screen")) {
        document.getElementById("loading-screen").style.display = "block";
      }

      // Generating the POST request to the backend
      const response = await axios.post(
        "http://localhost:8000/map-api/render-map",
        { date }
      );

      // Function to parse the LINESTRING coordinates
      function parseResponse(inputData) {
        return inputData.map(item => {
          // Extract the coordinates from the "geometry" string
          // Assuming lineString is in the format: 'LINESTRING (lon1 lat1, lon2 lat2, ...)'
          const coordinates = item.geometry
            .replace("LINESTRING (", "")
            .replace(")", "")
            .split(", ")
            .map(coord => coord.split(" ").reverse().map(Number));
      
          return {
            "geometry": coordinates,
            "street_calm_rate": item.street_calm_rate
          };
        });
      };
      return parseResponse(response.data);
    } catch (error) {
      if (document.getElementById("loading-screen")) {
        document.getElementById("loading-screen").style.display = "none";
      }

      // Handle any errors
      console.error("Error:", error);
      throw error;
    }
  },
};

export default ApiService;
