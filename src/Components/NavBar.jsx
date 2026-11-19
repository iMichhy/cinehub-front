import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
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


    const item = (to, label) => (
        <li className="nav-item">
            <NavLink className="nav-link" to={to} data-bs-dismiss="collapse">{label}</NavLink>
        </li>
    );

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">CineHub</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" aria-hidden="true"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {isConnected ? (
                        <>
                            <ul className="navbar-nav me-auto">
                                {item('/films', 'Films')}
                                {item('/screenings', 'Séances')}
                                {item('/rooms', 'Salles')}
                                {item('/reservations', 'Mes réservations')}
                                {isAdmin && (
                                    <>
                                        <li className="nav-item"><span className="badge text-bg-warning">Admin</span></li>
                                        {item('/admin/films', 'Films')}
                                        {item('/admin/rooms', 'Salles')}
                                        {item('/admin/screenings', 'Séances')}
                                        {item('/admin/reservations', 'Réservations')}
                                        {item('/admin/users', 'Users')}
                                    </>
                                )}
                            </ul>
                            <ul className="navbar-nav">
                                {item('/profile', user?.us_username)}
                                <li className="nav-item">
                                    <button className="btn btn-outline-light btn-sm" type="button" onClick={logout} data-bs-dismiss="collapse">
                                        Déconnexion
                                    </button>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <ul className="navbar-nav ms-auto">
                            {item('/login', 'Connexion')}
                            {item('/register', 'Inscription')}
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;