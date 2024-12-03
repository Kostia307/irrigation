import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, TextField, Button } from '@mui/material';
import { ThemeContext } from './ThemeContext';
import { useTheme } from '@emotion/react';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toggleColorMode, mode } = useContext(ThemeContext)
  const theme  = useTheme()
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://irrigationsystem.onrender.com/api/v1/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);

        if (data.token) {
          Cookies.set('token', data.token, { expires: 1 }); 
        }

        navigate('/main', {state: {username: data.username}});
      } else {
        console.error('Registration failed:', response.status);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleRegister}
      sx={{ maxWidth: 400, margin: 'auto' }}
    >
      <TextField
        required
        fullWidth
        id="username"
        label="Username"
        placeholder="Your username"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        required
        fullWidth
        id="email"
        label="Email"
        placeholder="Your email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        required
        fullWidth
        id="password"
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button color='inherit' sx={{ color: theme.palette.secondary.main }} onClick={() => navigate('/')} variant='contained'>
          Cancel 
        </Button>
        <Button color='inherit' sx={{ color: theme.palette.primary.main }} type='submit' variant='contained'>
          Register
        </Button>
      </Box>
    </Box>
  );
}

export default RegisterForm;
