import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Ensure this effect only runs once when the component mounts
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');  // Redirect if already logged in
    }
  }, [navigate]);  // Add navigate as a dependency to prevent infinite re-renders

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      login(response.data.token, response.data.username);
      navigate('/');  // Navigate to dashboard upon successful login
    } catch (error) {
      alert('Invalid login credentials');
    }
  };

  return (
    <>
      <img src="/logo.png" alt="logo" className="Logo" />
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            LOGIN
          </button>
          <Link to="/register" className="register-link">
            Register
          </Link>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
