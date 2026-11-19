import { useEffect, useState } from "react";
import { Link } from "react-router";
import userServices from "../Services/userServices";
import reservationServices from "../Services/reservationServices";

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [reservations, setReservations] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [form, setForm] = useState({ username: "", email: "" });
    const [message, setMessage] = useState(null);

    const fetchMe = async () => {
        try {
            const response = await userServices.getMe();
            setUser(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger votre profil." });
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await reservationServices.getMe();
            setReservations(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger vos réservations." });
        }
    };

    useEffect(() => {
        fetchMe();
        fetchReservations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setMessage(null);
    };

    const toggleEditForm = () => {
        // On préremplit le formulaire avec les infos actuelles
        setForm({ username: user.us_username || "", email: user.us_email || "" });
        setShowEditForm(!showEditForm);
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userServices.update(user.us_id, form);
            await fetchMe();
            setShowEditForm(false);
            setMessage({ type: "success", text: "Votre profil a bien été modifié." });
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La modification a échoué." });
        }
    };

    const totalSeats = reservations.reduce((sum, re) => sum + re.re_seats, 0);

    return (
        <main className="container py-4 py-md-5">
            <header className="mb-4">
                <p className="text-primary fw-semibold mb-1">Mon espace</p>
                <h1 className="h2 fw-bold mb-1">Mon profil</h1>
                <p className="text-secondary mb-0">Retrouvez vos informations et vos réservations.</p>
            </header>

            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}

            <section className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                            style={{ width: "4rem", height: "4rem" }}
                            aria-hidden="true"
                        >
                            <i className="bi bi-person fs-2"></i>
                        </div>
                        <div>
                            <h2 className="h4 fw-bold mb-1">{user.us_username}</h2>
                            <p className="text-secondary mb-0">{user.us_email}</p>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-4">
                        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2">
                            {reservations.length} réservation{reservations.length === 1 ? "" : "s"}
                        </span>
                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2">
                            {totalSeats} place{totalSeats === 1 ? "" : "s"} réservée{totalSeats === 1 ? "" : "s"}
                        </span>
                        <span className={`badge rounded-pill px-3 py-2 ${user.us_role === "admin" ? "bg-warning bg-opacity-25 text-warning-emphasis" : "bg-secondary bg-opacity-10 text-secondary"}`}>
                            {user.us_role === "admin" ? "Administrateur" : "Utilisateur"}
                        </span>
                    </div>
                </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                        <h2 className="h5 fw-bold mb-0">Mes réservations</h2>
                        <span className="badge rounded-pill bg-primary">{reservations.length}</span>
                    </div>
                    {reservations.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {reservations.map((re) => (
                                <li key={re.re_id} className="list-group-item px-0 d-flex justify-content-between align-items-center gap-3">
                                    <div>
                                        <span className="fw-semibold">{re.fi_title}</span>
                                        <div className="text-secondary small">{formatDate(re.sc_datetime)} · {re.ro_name}</div>
                                    </div>
                                    <span className="badge rounded-pill bg-secondary">{re.re_seats} place{re.re_seats === 1 ? "" : "s"}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-secondary mb-0">Vous n'avez pas encore de réservation. <Link to="/films">Voir les films</Link></p>
                    )}
                    {reservations.length > 0 && (
                        <Link className="btn btn-outline-primary btn-sm mt-3" to="/reservations">Gérer mes réservations</Link>
                    )}
                </div>
            </section>

            <section className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                        <div>
                            <h2 className="h5 fw-bold mb-1">Mes informations</h2>
                            <p className="text-secondary mb-0">Modifiez votre nom d'utilisateur ou votre adresse e-mail.</p>
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={toggleEditForm}
                            aria-expanded={showEditForm}
                            aria-controls="edit-profile-form"
                        >
                            {showEditForm ? "Annuler" : "Modifier mon profil"}
                        </button>
                    </div>

                    {showEditForm && (
                        <form id="edit-profile-form" className="mt-4 pt-4 border-top" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    id="username"
                                    autoComplete="username"
                                    onChange={handleChange}
                                    value={form.username}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Adresse e-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    onChange={handleChange}
                                    value={form.email}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Enregistrer
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default ProfilePage;