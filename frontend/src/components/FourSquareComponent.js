// // Implementing Foursquare Integration

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const FoursquareComponent = () => {
//   const [venues, setVenues] = useState([]);

//   useEffect(() => {
//     const fetchVenues = async () => {
//       const apiKey = 'FOURSQUARE_API_KEY';
//       const url = `https://api.foursquare.com/v2/venues/explore?ll=${latitude},${longitude}&client_id=${apiKey}`;
      
//       try {
//         const response = await axios.get(url);
//         setVenues(response.data.response.groups[0].items);
//       } catch (error) {
//         console.error('Error fetching Foursquare data:', error);
//       }
//     };

//     fetchVenues();
//   }, [latitude, longitude]);

//   return (
//     <div>
//       {/* Display Foursquare venues data */}
//       <ul>
//         {venues.map((venue) => (
//           <li key={venue.venue.id}>{venue.venue.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FoursquareComponent;
