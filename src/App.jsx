import './App.css'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router'
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
import AdminUsersPage from './Pages/Admin/AdminUsersPage'
import AdminWrapper from './Wrappers/AdminWrapper'
import AdminFilmsPage from './Pages/Admin/AdminFilmsPage'
import AdminRoomsPage from './Pages/Admin/AdminRoomsPage'
import AdminScreeningsPage from './Pages/Admin/AdminScreeningsPage'
import AdminReservationsPage from './Pages/Admin/AdminReservationsPage'


function AppContent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <>
      <NavBar />
      {pathname !== '/' && (
        <div className="container">
          <button type="button" className="btn btn-primary btn-sm" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2" aria-hidden="true"></i>Retour
          </button>
        </div>
      )}

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

        <Route path='/admin/films' element={<AdminWrapper> <AdminFilmsPage /> </AdminWrapper>} />
        <Route path='/admin/rooms' element={<AdminWrapper> <AdminRoomsPage /> </AdminWrapper>} />
        <Route path='/admin/screenings' element={<AdminWrapper> <AdminScreeningsPage /> </AdminWrapper>} />
        <Route path='/admin/reservations' element={<AdminWrapper> <AdminReservationsPage /> </AdminWrapper>} />
        <Route path='/admin/users' element={<AdminWrapper> <AdminUsersPage /> </AdminWrapper>} />
      </Routes>
    </>
  )
}

function App() {
  const [isConnected, setIsConnected] = useState(authService.isConnected());
  const [user, setUser] = useState(authService.getUser());

  return (
    <AuthContext.Provider value={{ isConnected, setIsConnected, user, setUser }}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App