import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import AuthContext from '../Contexts/AuthContext';
import authServices from '../Services/authServices';

const NavBar = () => {
    const { isConnected, setIsConnected, user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAdmin = user?.us_role === 'admin';

    const logout = () => {
        authServices.logout();
        setIsConnected(false);
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="navbar bg-body-tertiary mb-4">
            <div className="container d-flex flex-wrap gap-3 align-items-center">
                <Link className="navbar-brand" to="/">CineHub</Link>

                {isConnected ? (
                    <>
                        <Link to="/films">Films</Link>
                        <Link to="/screenings">Séances</Link>
                        <Link to="/rooms">Salles</Link>
                        <Link to="/reservations">Mes réservations</Link>
                        {isAdmin && (
                            <>
                                <span className="badge text-bg-warning">Admin</span>
                                <Link to="/admin/films">Films</Link>
                                <Link to="/admin/rooms">Salles</Link>
                                <Link to="/admin/screenings">Séances</Link>
                                <Link to="/admin/reservations">Réservations</Link>
                                <Link to="/admin/users">Users</Link>
                            </>
                        )}
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <Link to="/profile">{user?.us_username}</Link>
                            <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Déconnexion</button>
                        </div>
                    </>
                ) : (
                    <div className="ms-auto d-flex gap-3">
                        <Link to="/login">Connexion</Link>
                        <Link to="/register">Inscription</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;