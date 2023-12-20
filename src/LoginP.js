import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword  // Added this import
} from 'firebase/auth';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailPasswordLogin = (e) => {
    e.preventDefault();
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/landing', { state: { email: user.email } });
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show error message to user)
      });
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        navigate('/landing', { state: { email: result.user.email } });
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show error message to user)
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleEmailPasswordLogin}>
        <h2>Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Sign In</button>
        <button type="button" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
