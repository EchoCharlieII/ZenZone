import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'

const Home = () => {
    return (
    <div className="home-container">
        <div className="animated-background">
            <div className="falling-leaves"></div>
        </div>
        <div className="content"> 
            <h1 className="home-title">Welcome to ZenZone</h1>
            <p className="home-description">Discover serene spots and hidden gems in nature</p>
            {/* Add logo. */}
            <img className="home-image" src="/path/to/logo.jpg" alt="ZenZone logo" />
            {/* Add routing. */}
            <button className="home-button">Explore Now</button>
        </div>
    </div>
  );
};

export default Home;
