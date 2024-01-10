import React from 'react';
import MapComponent from './MapComponent';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the Taxi App</h1>
      <p>You are signed in with the email: {email}</p>
      <MapComponent />
    </div>
  );
};

export default LandingPage;
