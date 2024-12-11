import React from 'react';
import './ThankYouPage.css';  // Import the CSS file for styling

const ThankYouPage = () => {
    return (
        <div className="thank-you-container">
            <div>
                <h1>Thank You for Your Registration!</h1>
                <p>Your registration was successful. We are going to respone via email as soon as.</p>
                <a href="/">
                    <button className="thank-you-button">Back To Home</button>
                </a>
            </div>
        </div>
    );
};

export default ThankYouPage;
