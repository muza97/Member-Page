import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import MapComponent from './MapComponent';

const LandingPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user ? user.email : 'User';
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout Error:', error);
      });
  };

  return (
    <div>
      <h1>Welcome to the Taxi App</h1>
      <p>Welcome, {userEmail}</p>
      <button onClick={handleLogout}>Logout</button>
      <MapComponent />
    </div>
  );
};

export default LandingPage;
