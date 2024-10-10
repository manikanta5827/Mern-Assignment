import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import api from '../api';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();  // useNavigate replaces useHistory

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', { username, password, email });
      navigate('/login');  // navigate replaces history.push
    } catch (error) {
      alert('Error occurred during registration');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
      />
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
