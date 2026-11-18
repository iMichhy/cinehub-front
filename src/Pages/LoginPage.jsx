import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import authServices from '../Services/authServices';
import AuthContext from '../Contexts/AuthContext';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setIsConnected } = useContext(AuthContext);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await authServices.login(user);
            const token = response.data.token;
            if (token) {
                window.localStorage.setItem("token", token);
                axios.defaults.headers.common.Authorization = "Bearer " + token;
                setIsConnected(true);
                setMessage({
                    type: "success",
                    text: "Connexion réussie."
                });
                navigate('/profile');
            } else {
                console.error('Aucun token trouvé dans la réponse de connexion :', response.data);
                setMessage({
                    type: "warning",
                    text: "Connexion effectuée, mais aucun token n'a été reçu."
                });
            }
        } catch (error) {
            console.error(error);
            setMessage({
                type: "danger",
                text: error?.response?.data?.message || "La connexion a échoué. Vérifie tes identifiants."
            });
        }
    };

    return (
        <main className="login-page d-flex align-items-center justify-content-center p-3">
            <section className="login-card card shadow-sm border-0 w-100">
                <div className="card-body p-4 p-md-5">
                    <h1 className="h2 text-center mb-4">Connexion</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="loginUsername" className="form-label">Username</label>
                            <input
                                type="username"
                                id="loginUsername"
                                name="username"
                                className="form-control"
                                placeholder="Identifiant"
                                autoComplete="username"
                                value={user.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="loginPassword" className="form-label">Mot de passe</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="loginPassword"
                                    name="password"
                                    className="form-control"
                                    placeholder="Mot de passe"
                                    autoComplete="current-password"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    type="button"
                                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className={`alert alert-${message.type}`} role="alert">
                                {message.text}
                            </div>
                        )}

                        <button className="btn btn-primary w-100" type="submit">
                            Se connecter
                        </button>
                    </form>
                    <p className="text-center mb-0 mt-4">
                        Pas encore inscrit ? <Link to="/register">S'inscrire</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default LoginPage;