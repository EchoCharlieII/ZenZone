import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Map from './pages/map';
//import MyMap from './components/MyMap';
import MapRoute from './pages/route';

 
function App() {
    return (
        <div>
            <Router>
                <Navbar />
                <Routes>
                    <Route exact path='/' exact element={<Home />} />
                    <Route path='/map' element={<Map />} />
                    <Route path='/route' element={<MapRoute />} />
                </Routes>
            </Router>     
        </div>
    );
}
 
export default App;
