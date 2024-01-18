import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3500/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(`User registered successfully: ${data.email}`);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Error registering user');
    }
  };

  return (
    <div>
      <h2>Register User</h2>
      <form onSubmit={handleRegistration}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserRegistration;
