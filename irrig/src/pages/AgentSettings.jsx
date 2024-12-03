import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { AppBar, IconButton, Toolbar, Typography, SvgIcon, Button, Box, CircularProgress, Modal, TextField, Backdrop, Fade, Stack } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { ThemeContext } from './ThemeContext'
import { useTheme } from '@emotion/react';

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
    const [modalOpen, setModalOpen] = useState(false)
    const [wateringModalOpen, setWateringModalOpen] = useState(false)

    const { toggleColorMode, mode } = useContext(ThemeContext)
    const theme  = useTheme()

    const [formValues, setFormValues] = useState({
      title: agentGt?.title || '',
      description: agentGt?.description || '',
      location: agentGt?.location || '',
      unigue_identificator: agentGt?.unigue_identificator || ''
    });
    const [initialValues, setInitialValues] = useState(null)

    const [waterings, setWaterings] = useState([])
    const [wateringFormValues, setWateringFormValues] = useState({
      appointment_time: '',
      intensity: 0
    })

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

      if (agentGt && JSON.stringify(agentGt) !== JSON.stringify(initialValues)) {
        setInitialValues(agentGt)
        setFormValues({
          title: agentGt.title,
          description: agentGt.description,
          location: agentGt.location,
          unigue_identificator: agentGt.unigue_identificator
        })
      }

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
              'authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })
        if(response.ok) {
            
            const data = await response.json()
            setAgentGt(data)
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

    fetchData();

    const fetchWaterings = async () => {
      try{
      const token = Cookies.get('authToken')

      if (!token) {
        console.error('No token found, redirecting to login')
        navigate('/')
        return
      }

      const response = await fetch('https://irrigationsystem.onrender.com/api/v1/watering',{
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'authorization': `Bearer ${token}`
          },
        credentials: 'include'
      })
      if(response.ok){
        const data = await response.json()
        setWaterings(data)
      }
    }catch(error) {
      console.error('Failed to fetch waterings ', error)
    }

    }

    fetchWaterings();

    }, [agentGt])

    if (isLoading){
      return <Box><CircularProgress /></Box>
    }

    if (!agentGt || Object.keys(agentGt).length === 0) {
      return <Typography>Error loading agent details. Please try again</Typography>
    }

    const editAgent = async () => {
      const agent_id = agent.id
      const updatedAgentData = {
        title: formValues.title,
        location: formValues.location,
        description: formValues.description,
        unigue_identificator: formValues.unigue_identificator,
        author_id: agentGt.author.id 
      }
      console.log(updatedAgentData)
      try {
        const token = Cookies.get('authToken')

        if (!token) {
          console.error('No token found, redirecting to login')
          navigate('/')
          return
        }

        const response = await fetch(`https://irrigationsystem.onrender.com/api/v1/agent/${agent_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ${token}'
          },
          credentials: 'include',
          body: JSON.stringify(updatedAgentData)
        })

        if (!response.ok) {
          throw new Error(`Failed to update agent: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Agent updated successfully: ', data)
      } catch (error) {
        console.error('Error updating agent: ', error.message)
      }
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };

    const handleDelete = async () => {
      const agent_id = agent.id
      const confirmation = window.confirm(`Are you sure you want to delete agent №${agent_id}`)
      if(confirmation){
        try {
          const response = await fetch(`https://irrigationsystem.onrender.com/api/v1/agent/${agent_id}`,{
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ${token}'
          },
          credentials: 'include',
          })

          if(response.ok) {
            alert("Deleted successfully!")
            navigate('/main', { state: { agent, username: username, id: id } })
          } else {
            alert("Failed to delete")
          } 
        } catch (error) {
          console.error("Error deleting an agent:", error)
        }
      } 
    }

    const handleWateringDelete = async (watering_id) => {
      const confirmation = window.confirm(`Are you sure you want to delete this?`)
      if(confirmation){
        try {
          const response = await fetch(`https://irrigationsystem.onrender.com/api/v1/watering/${watering_id}`,{
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ${token}'
          },
          credentials: 'include',
          })

          if(response.ok) {
            alert("Watering deleted successfully!")
          } else {
            alert("Failed to delete watering")
          } 
        } catch (error) {
          console.error("Error deleting watering:", error)
        }
      }
    }

    const handlePlanNew = async (waterForm) => {
      const agent_id = agent.id
      console.log(waterForm)
      try {
        const token = Cookies.get('authToken')

        if (!token) {
          console.error('No token found, redirecting to login')
          navigate('/')
          return
        }
        const response = await fetch(`https://irrigationsystem.onrender.com/api/v1/watering/${agent_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ${token}'
          },
          credentials: 'include',
          body: JSON.stringify(waterForm),
        });
    
        if (!response.ok) {
          throw new Error(`Error planning new watering, status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Watering planned successfully:', data);
      } catch (error) {
        console.error('Error planning watering:', error);
      }
    }

    

  return (
    <>
    <AppBar position='fixed' sx={{
      display: 'flex',
      flexDirection: 'row',
      boxShadow: 3,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary
    }}>
      <Toolbar sx={{width: '100%', justifyContent: 'space-between'}}>
        <IconButton
          color='inherit'
          onClick={ toggleColorMode }
          edge='start'
          sx={{ marginRight: 2}}
        >
          { mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Typography component='div' variant='h6' sx={{flexGrow: 1}}>
          Authorized as { username ? username: 'User' }
        </Typography>
        <Button color="inherit" onClick={ handleCreateAgent } sx={{ marginLeft: 1 , color: theme.palette.primary.main}}>Create a new agent</Button>
        <Button color="inherit" onClick={ handleLogOut } sx={{ marginLeft: 2 , color: theme.palette.secondary.main}}>Log out</Button>
      </Toolbar>
    </AppBar>

    {/*Agent info box*/}
    <Typography variant='subtitle1' sx={{mt:10}}>Settings of Agent {agent.title}</Typography>
    <Box
      sx={{
        width: "70%",
        padding: 2,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        bgcolor: 'background.paper',
        justifyContent: "space-between",
        marginLeft: 3
      }}
    >
      <Box sx={{ marginLeft: 3 }}>
        <Typography variant="subtitle1" align='left'>
          №: { agentGt.id}
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Title: { agentGt.title }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Location: { agentGt.location }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Description: { agentGt.description }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Unique Identificator: { agentGt.unigue_identificator }
        </Typography>
        <Typography variant="subtitle1" align='left'>
          Created at: { dayjs(agentGt.created_at).format("YYYY-MM-DD HH:mm:ss") }
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
        <Button color="inherit" variant="contained" sx={{ marginRight: 3, color: theme.palette.primary.main }} onClick={() => setModalOpen(true)}>
          Edit
        </Button>
        
        <Button color="inherit" variant="contained" sx={{ marginRight: 3, color: theme.palette.secondary.main }} onClick={handleDelete}>
          Delete
        </Button>
        <Button
          variant="contained"
          color="inherit"
          sx={{ marginRight: 3 }}
          onClick={() => navigate('/main', { state: { agent, username: username, id: id } })}
        >
        Main Page
        </Button>
      </Box>
    </Box>

    {/*Editing modal*/}
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={modalOpen}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Agent Details
          </Typography>
          <form onSubmit={(e) => {e.preventDefault(); editAgent(formValues); setModalOpen(false)}}>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formValues.title}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="location"
              label="Location"
              value={formValues.location}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formValues.description}
              onChange={handleInputChange}
              margin="normal"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button color="inherit" variant="outlined" sx={{color: theme.palette.secondary.main}} onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button color="inherit" type="submit" variant="contained" sx={{color: theme.palette.primary.main}}>
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>

    {/*Watering box*/}

    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        margin: '16px 0',
        bgcolor: 'background.paper',
        marginLeft: 3
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h7" textAlign="center" sx={{ flex: 1 }}>
          Watering Sessions
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => setWateringModalOpen(true)}
          sx={{ marginLeft: 'auto', color: theme.palette.primary.main }}
        >
          Plan New Watering
        </Button>
      </Stack>

      {waterings.map((watering) => (
        <Box
          key={watering.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            borderBottom: '1px solid #ddd',
          }}
        >
          <Typography>
            {`Date: ${watering.appointment_time} | Intensity: ${watering.intensity} | Host: ${watering.host_agent_id}`}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => handleWateringDelete(watering.id)}
            sx={{ marginLeft: '8px' , color: theme.palette.secondary.main}}
          >
            Delete
          </Button>
        </Box>
      ))}
    </Box>

    {/* Plannig new watering modal */}
    <Modal
      open={wateringModalOpen}
      onClose={() => setWateringModalOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={wateringModalOpen}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            New Watering
          </Typography>
          <form 
            onSubmit={(e) => {
              e.preventDefault(); 
              handlePlanNew(wateringFormValues) 
              setWateringModalOpen(false)}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                sx={{width: '100%'}}
                fullWidth
                label="Appointment Date and Time"
                value={dayjs(wateringFormValues.appointment_time)}
                onChange={(newValue) => {
                  setWateringFormValues({
                    ...wateringFormValues,
                    appointment_time: dayjs(newValue).format("YYYY-MM-DD HH:mm:ss") 
                  });
                }}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" InputLabelProps={{ shrink: true }}/>}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              type='number'
              name="Instensity (seconds)"
              label="Instensity (seconds)"
              value={wateringFormValues.intensity}
              onChange={(e) =>
                setWateringFormValues((prev) => ({
                  ...prev,
                  intensity: parseInt(e.target.value, 10) || '',
                }))
              }
              margin="normal"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button color="inherit" variant="outlined" sx={{color: theme.palette.secondary.main}} onClick={() => setWateringModalOpen(false)}>
                Cancel
              </Button>
              <Button color="inherit" type="submit" variant="contained" sx={{color: theme.palette.primary.main}}>
                Plan
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
    </>
  )
}

export default AgentSettings