import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserdata } from './redux/userSlice'
import getCurrentUser from './features/getCurrentUser'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser()
      dispatch(setUserdata(data))
    }
    getUser()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page — default entry */}
        <Route path="/" element={<LandingPage />} />

        {/* Dedicated auth page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Main chat app */}
        <Route path="/app" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
