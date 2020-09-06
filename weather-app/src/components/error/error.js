import React from 'react';
import './error.css'
const Error = () => {
    return (
        <div className="error">
            <h1>City not found</h1>
            <p>To make the search more precise put the city's name, comma, country name. You will get all proper cities in chosen country.</p>
        </div>
    );
}
export default Error;