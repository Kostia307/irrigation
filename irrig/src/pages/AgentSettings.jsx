import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { AppBar, IconButton, Toolbar, Typography, SvgIcon, Button, Box, CircularProgress } from '@mui/material'

function LightModeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
    </SvgIcon>
  );
}

function DarkModeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
    </SvgIcon>
  );
}

function AgentSettings() {
    const location = useLocation()
    const { agent } = location.state || {}
    const { username } = location.state || {}
    const { id } = location.state || {}
    const navigate = useNavigate()
    const [ agentGt, setAgentGt ] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [darkMode, setDarkmode] = React.useState(false)

    const handleThemeToggle = () => {
    setDarkmode((prevMode) => !prevMode)
    //TODO: create theme changing function
    }

    const handleLogOut = async () => {
      try {
       Cookies.remove('token')
       navigate('/')
      } catch (error) {
       console.error('Error during logout:', error);
      }
    }

    const handleCreateAgent = () => {
      navigate('/agent/create', {state: {
        username: username,
        id: id
        }})
    }

    useEffect(() => {
      const agent_id = agent.id
      const fetchData = async () => { 
      try{
        const token = Cookies.get('authToken')

        if (!token) {
          console.error('No token found, redirecting to login')
          navigate('/')
          return
        }
        const response = await fetch(`https://irrigationsystem.onrender.com/api/v1/agent/${agent_id}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'authorization': 'Bearer ${token}'
            },
            credentials: 'include'
        })
        //console.log(response)
        if(response.ok) {
            
            const data = await response.json()
            setAgentGt(data)
            //console.log(agentGt)
            //console.log(agentGt.author)
        }
        else {
            console.error('Failed to fetch data', response.status)
            setAgentGt({})
        }
      } catch(error) {
        console.error('Error fetching data: ', error)
        setAgentGt({})
      } finally {
        setIsLoading(false)
      }
    }  
    fetchData()
    }, [agent.id, navigate])

    if (isLoading){
      return <Box><CircularProgress /></Box>
    }

    if (!agentGt || Object.keys(agentGt).length === 0) {
      return <Typography>Error loading agent details. Please try again</Typography>
    }

  return (
    <>
    <AppBar position='fixed' sx={{
      display: 'flex',
      flexDirection: 'row',
      boxShadow: 3
    }}>
      <Toolbar sx={{width: '100%', justifyContent: 'space-between'}}>
        <IconButton
          color='inherit'
          onClick={handleThemeToggle}
          edge='start'
          sx={{ marginRight: 2}}
        >
          { darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Typography component='div' variant='h6' sx={{flexGrow: 1}}>
          Authorized as { username ? username: 'User' }
        </Typography>
        <Button color="inherit" onClick={ handleCreateAgent } sx={{ marginLeft: 1 }}>Create a new agent</Button>
        <Button color="inherit" onClick={ handleLogOut } sx={{ marginLeft: 2 }}>Log out</Button>
      </Toolbar>
    </AppBar>

    <Typography variant='subtitle1' sx={{mt:10}}>Settings of Agent {agent.title}</Typography>
    <Box
      sx={{
        width: "70%",
        backgroundColor: "whitesmoke",
        padding: 2,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 3
      }}
    >
      <Box sx={{ marginLeft: 3 }}>
        <Typography variant="subtitle1" align='left'>
          №: { agent.id}
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Title: { agent.title }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Location: { agent.location }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Description: { agent.description }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Unique Identificator: { agentGt.unigue_identificator }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Created at: { new Date(agent.created_at).toLocaleString() }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Author: { agentGt.author.username }
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Button variant="contained" color="primary" sx={{ marginRight: 3 }}>
          Edit
        </Button>
        <Button variant="contained" color="secondary" sx={{ marginRight: 3 }}>
          Delete
        </Button>
        <Button
          variant="contained"
          color="info"
          sx={{ marginRight: 3 }}
          onClick={() => navigate('/main', { state: { agent, username: username, id: id } })}
        >
        Main Page
        </Button>
      </Box>
    </Box>
    </>
  )
}

export default AgentSettings