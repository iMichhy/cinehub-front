import { useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../Contexts/AuthContext";

const HomePage = () => {
    const navigate = useNavigate();
    const { isConnected, user } = useContext(AuthContext);

    return (
        <main className="container py-4 py-md-5">
            <section
                className="d-flex align-items-center border rounded-4 bg-body-tertiary shadow-sm px-3 px-md-5 py-5"
                style={{ minHeight: "70vh" }}
            >
                <div style={{ maxWidth: 640 }}>
                    <p className="text-primary text-uppercase fw-semibold small mb-3" style={{ letterSpacing: "0.28em" }}>
                        Cinéma
                    </p>
                    <h1 className="display-3 fw-bold mb-3" style={{ lineHeight: 0.95 }}>
                        Accueil
                    </h1>
                    <p className="fs-5 text-secondary mb-4">
                        {isConnected
                            ? `Bonjour ${user?.us_username}, que souhaitez-vous faire ?`
                            : "Connectez-vous ou créez un compte pour réserver vos séances."}
                    </p>

                    <div className="bg-primary mb-4" style={{ width: 72, height: 2 }}></div>

                    <div className="d-flex flex-column flex-sm-row flex-wrap gap-3">
                        {isConnected ? (
                            <>
                                <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate("/films")}>
                                    <i className="bi bi-film me-2" aria-hidden="true"></i>Films
                                </button>
                                <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => navigate("/screenings")}>
                                    <i className="bi bi-calendar-event me-2" aria-hidden="true"></i>Séances
                                </button>
                                <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => navigate("/reservations")}>
                                    <i className="bi bi-ticket-perforated me-2" aria-hidden="true"></i>Mes réservations
                                </button>
                                <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => navigate("/rooms")}>
                                    <i className="bi bi-door-open me-2" aria-hidden="true"></i>Salles
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>
                                    Se connecter
                                </button>
                                <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => navigate("/register")}>
                                    Créer un compte
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;