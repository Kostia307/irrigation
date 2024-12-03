import React, { useContext } from 'react'
import { Box, Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie'
import { ThemeContext } from './ThemeContext';
import { useTheme } from '@emotion/react';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toggleColorMode, mode } = useContext(ThemeContext)
  const theme  = useTheme()
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://irrigationsystem.onrender.com/api/v1/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
        credentials: 'include'
      });

      if(response.ok){
        const data = await response.json();
        console.log('Login succesful:',data);

        Cookies.set('authToken', data.token, { expires: 1, secure: true})
        
        navigate('/main', {state: {username: data.username, id: data.id}});
      } else {
        console.error('Login failed: ', response.status);
      }
    } catch(error) {
      console.error('Error during login:', error);
    }
  }
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleLogin}
      sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: 400, margin: 'auto', mt: 3 }}
    >
      <TextField 
        required
        fullWidth
        id='outlined-required'
        label="Email"
        placeholder='Your email'
        margin='normal'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        required
        fullWidth
        id='outlined-password-input'
        label="Password"
        type='password'
        margin='normal'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="contained"
          color='inherit'
          onClick={() => navigate('/register')}
          sx={{ alignSelf: 'flex-start', color: theme.palette.primary.main }}
        >
          Create Account
        </Button>
        <Button
          type="submit"
          color='inherit'
          variant='contained'
          sx={{ alignSelf: 'flex-end', color: theme.palette.primary.main }}
        >
          Log in
        </Button>
      </Box>
    </Box>
  )
}

export default AuthForm