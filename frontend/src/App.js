import React from 'react';
// import './App.css';
// import Navbar from './components/Navbar/';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Map from './pages/map';
import Home from './pages/index';

 
// Defining the App component that contains the routes for the application
function App() {
    return (
        // Wrapping the routes with the Router component to enable routing
        <div>
            <Router>
                <Routes>
                    {/* Route for the root path '/' which renders the Home component */}
                    <Route exact path='/' element={<Home />} /> 

                    {/* Route for the '/map' path which renders the Map component */}
                    <Route path='/map' element={<Map />} />
                </Routes>
            </Router>     
        </div>
    );
}

// Exporting the App component as the default export of this module
export default App;