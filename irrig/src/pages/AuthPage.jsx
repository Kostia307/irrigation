import { React, useState } from 'react'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid'
import { createTheme, TextField } from '@mui/material'
import AuthForm from './AuthForm'

function AuthPage() {
  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        minHeight={'100vh'}
        minWidth={'100vh'}
        >
        <Box 
          bgcolor={'white'}
          p={4}
          borderRadius={2}
          boxShadow={3}
          width={'350px'}
        >
          <Grid2 container spacing={2} direction={'column'}>
            <Grid2 item><div className='no-wrap'>Welcome to the Automated Irrigation System!</div></Grid2>
            <Grid2 item><div className='no-wrap'>Enter you name and password to proceed</div></Grid2>
            <Grid2 item><AuthForm/></Grid2>
          </Grid2>
        </Box>      
      </Box>
    </>
  )
}

export default AuthPage
