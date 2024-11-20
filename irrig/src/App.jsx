import { useState } from 'react'
import AuthPage from './pages/authPage'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import RegisterPage from './pages/RegisterPage'
import CreateAgent from './pages/CreateAgent'
import AgentSettings from './pages/AgentSettings'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/agent/create' element={<CreateAgent />} />
        <Route path='/agent/settings' element={<AgentSettings />} />
      </Routes>
    </div>
  )
}

export default App
