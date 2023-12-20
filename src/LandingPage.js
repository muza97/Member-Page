import React from 'react';
import { useLocation } from 'react-router-dom';

const LandingPage = () => {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div>
      {email ? (
        <p>You are signed in with the email: {email}</p>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
};

export default LandingPage;
