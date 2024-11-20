import React, { useEffect, useState } from 'react';
import { Grid2, Card, CardContent, CardMedia, Typography, Box, CircularProgress, Button } from '@mui/material';
import Cookies from 'js-cookie'
import { useNavigate,useLocation } from 'react-router-dom';

function Agents() {
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const { username } = location.state || {}
    const { id } = location.state || {}
    const navigate = useNavigate()

    useEffect(() => {
      const fetchData = async () => { 
      try{
        const token = Cookies.get('authToken')

        if (!token) {
          console.error('No token found, redirecting to login')
          navigate('/')
          return
        }
        const response = await fetch("https://irrigationsystem.onrender.com/api/v1/agent", {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'authorization': 'Bearer ${token}'
            },
            credentials: 'include'
        })
        if(response.ok) {
            const data = await response.json()
            setAgents(data)
        }
        else {
            console.error('Failed to fetch data', response.status)
        }
      } catch(error) {
        console.error('Error fetching data: ', error)
      } finally {
        setLoading(false)
      }

    }

    fetchData()
    }, [])

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>;
    }

  return (
    <Box sx={{ padding: '2rem', marginTop: '75px' }}>
  <Grid2 container spacing={2}>
    {agents.map((agent) => (
      <Grid2 xs={12} sm={6} md={4} key={agent.id}>
        <Card 
          sx={{
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)'
            },
            minWidth: '200px'
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle2" color="textSecondary">
                №: {agent.id}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'bold',
                  color: agent.is_online ? 'green' : 'red',
                }}
              >
                {agent.is_online ? 'Online' : 'Offline'}
              </Typography>
            </Box>
            <Typography variant="h6">{agent.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {agent.location}
            </Typography>
          </CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            <Button
              variant="outlined"
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(0, 123, 255, 0.1)',
                },
              }}
              onClick={() => navigate('/agent/settings', { state: { agent, username: username, id: id } })}
            >
              Settings
            </Button>
          </Box>
        </Card>
      </Grid2>
    ))}
  </Grid2>
</Box>
  )
}

export default Agents