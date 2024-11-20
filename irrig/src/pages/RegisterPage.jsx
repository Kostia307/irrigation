import { React, useState } from 'react'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid'
import { createTheme, TextField, Typography } from '@mui/material'
import RegisterForm from './RegisterForm'

function RegisterPage() {
  return (
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
            <Grid2 item><Typography variant='h5'>Create new account</Typography></Grid2>
            <Grid2 item><RegisterForm /></Grid2>
          </Grid2>
        </Box>      
      </Box>
  )
}

export default RegisterPage