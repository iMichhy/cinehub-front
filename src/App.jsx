import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { useState } from 'react'
import AuthContext from './Contexts/AuthContext'
import NavBar from './Components/NavBar'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import ProfilePage from './Pages/ProfilePage'
import FilmsPage from './Pages/FilmsPage'
import FilmDetailPage from './Pages/FilmDetailPage'
import ScreeningsPage from './Pages/ScreeningsPage'
import ScreeningDetailPage from './Pages/ScreeningsDetailPage'
import RoomsPage from './Pages/RoomsPage'
import MyReservationsPage from './Pages/MyReservationsPage'
import authService from './Services/authServices'
import AuthWrapper from './Wrappers/AuthWrapper'


function App() {
  const [isConnected, setIsConnected] = useState(authService.isConnected());
  const [user, setUser] = useState(authService.getUser());

  return (
    <AuthContext.Provider value={{ isConnected, setIsConnected, user, setUser }}>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route path='/profile' element={<AuthWrapper> <ProfilePage /> </AuthWrapper>} />
          <Route path='/films' element={<AuthWrapper> <FilmsPage /> </AuthWrapper>} />
          <Route path='/films/:id' element={<AuthWrapper> <FilmDetailPage /> </AuthWrapper>} />
          <Route path='/screenings' element={<AuthWrapper> <ScreeningsPage /> </AuthWrapper>} />
          <Route path='/screenings/:id' element={<AuthWrapper> <ScreeningDetailPage /> </AuthWrapper>} />
          <Route path='/rooms' element={<AuthWrapper> <RoomsPage /> </AuthWrapper>} />
          <Route path='/reservations' element={<AuthWrapper> <MyReservationsPage /> </AuthWrapper>} />

        
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App