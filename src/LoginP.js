// LoginPage.js
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './LoginPage.css'; // Make sure to create and import your CSS file for styling

const LoginPage = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token.
        // Handle successful sign in here (e.g., redirect to another page)
      })
      .catch((error) => {
        // Handle Errors here.
        console.error('Error during Google sign-in:', error);
      });
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
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
