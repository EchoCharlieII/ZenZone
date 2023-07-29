import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Home.css';
import ScrollIcon from './ScrollIcon';
import { Link } from 'react-router-dom';

const Home = () => {
    const section1 = useRef(null);
    const section2 = useRef(null);
    const [section2Opacity, setSection2Opacity] = useState(0);

    // Scroll position and window height variables
    let scrollPos = 0;
    let windowH = 0;

    // Function to update elements based on the scroll position
    const updateElements = () => {
        // Check if refs are assigned
        if (!section1.current || !section2.current) {
            return;
        }

        const progress = scrollPos / windowH;
        console.log("progress:", progress);  // <- for debugging
        gsap.to(section1.current, { opacity: 1 - progress });
        gsap.to(section2.current, { opacity: progress });

        setSection2Opacity(progress);
        console.log("section2 opacity:", section2.current.style.opacity);  // <- for debugging
    };

    useEffect(() => {
        // Disable the default scroll
        document.body.style.overflow = 'hidden';

        // Get the window height
        windowH = window.innerHeight;

        // Listen to the wheel event
        window.addEventListener('wheel', (e) => {
            // Update the scroll position
            scrollPos += e.deltaY;

            // Make sure the scroll position is not outside the boundaries
            if (scrollPos < 0) scrollPos = 0;
            else if (scrollPos > windowH) scrollPos = windowH;

            // Update the elements
            updateElements();
        });

        // Update the elements based on the initial scroll position
        updateElements();

        // Set initial opacity of section 2 to 0
        gsap.set(section2.current, { opacity: 0 });

        // Listen to the transitionend event
        section2.current.addEventListener('transitionend', (e) => {
            // If the transitioned property is 'opacity' and the new opacity is '1'...
            if (e.propertyName === 'opacity' && e.target.style.opacity === '1') {
                // Find all .section2-description elements and trigger their animations
                document.querySelectorAll('.section2-description').forEach((desc) => {
                    desc.style.animationPlayState = 'running';
                });
            }
        });
    }, []);

    useEffect(() => {
        // Get the ScrollIcon by its class or id
        const scrollIcon = document.querySelector("#mouse-scroll");

        // If the ScrollIcon exists...
        if (scrollIcon) {
            // If section2Opacity is 1, hide the ScrollIcon. Otherwise, show it.
            scrollIcon.style.display = section2Opacity >= 0.99 ? 'none' : 'block';
        }
    }, [section2Opacity]);

    return (
        <div className="home-container">
            <div ref={section1} id="section1">
                <div className="content">
                    <h1 className="home-title">Find Your Zen</h1>
                    <p className="home-description">Ready to uncover NYC's secret havens with ZenZone?</p>
                </div>
            </div>
            <div ref={section2} id="section2">
                <div className="content">
                    <p className="section2-description line1">Embark on a journey of tranquility.</p>
                    <p className="section2-description line2">Discover the serene spots and hidden gems of New York City.</p>
                    <p className="section2-description line3">Unravel the Unseen, Embrace the Calm.</p>
                </div>
            </div>
            {section2Opacity >= 0.99 && (
                <Link to="/map" style={{ textDecoration: 'none' }}>
                    <button className="home-button">Explore Now</button>
                </Link>
            )}
            <ScrollIcon />
        </div>
    );
};

export default Home;
