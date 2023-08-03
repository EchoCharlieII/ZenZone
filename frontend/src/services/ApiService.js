import axios from "axios";

const ApiService = {
  renderBestRoute: async (selectedDate, startLocation, endLocation, mode) => {
    try {
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
      console.log("Data:", response.data);
      return response;
    } catch (error) {
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

      return response;
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
