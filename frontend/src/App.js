import React from 'react';
import './App.css';
import Navbar from './components/Navbar/'; // Yi debug record
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Map from './pages/map';
//import MyMap from './components/MyMap';
import MapRoute from './pages/route';
import Home from './pages/index'; // Yi debug record

 
function App() {
    return (
        <div>
            <Router>
                <Navbar />
                <Routes>
                    <Route exact path='/' element={<Home />} /> 
                    {/* Yi debug record */}
                    <Route path='/map' element={<Map />} />
                    <Route path='/route' element={<MapRoute />} />
                </Routes>
            </Router>     
        </div>
    );
}
 
export default App;
