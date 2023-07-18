// This is the component that will show a loading icon for the page

import React from 'react';
import './loading.css';

const Loading = () => (
    <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
    </div>
);

export default Loading;