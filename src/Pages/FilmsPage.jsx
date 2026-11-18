import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import filmServices from '../Services/filmServices';

const FilmsPage = () => {
    const [films, setFilms] = useState([]);
    const [onlyShowing, setOnlyShowing] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = onlyShowing ? await filmServices.getShowing() : await filmServices.getAll();
                setFilms(response.data);
            } catch (error) {
                setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger les films." });
            }
        };
        load();
    }, [onlyShowing]);

    return (
        <main className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h2 mb-0">Films</h1>
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="onlyShowing"
                        checked={onlyShowing} onChange={() => setOnlyShowing(!onlyShowing)} />
                    <label className="form-check-label" htmlFor="onlyShowing">À l'affiche uniquement</label>
                </div>
            </div>

            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}

            <div className="row g-3">
                {films.map((film) => (
                    <div className="col-md-4" key={film.fi_id}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h2 className="h5">{film.fi_title}</h2>
                                <p className="text-muted mb-1">{film.fi_genre} · {film.fi_duration} min</p>
                                {!film.fi_is_showing && <span className="badge text-bg-secondary">Hors affiche</span>}
                                <p className="mt-2 mb-0">{film.fi_description}</p>
                            </div>
                            <div className="card-footer bg-transparent border-0">
                                <Link className="btn btn-primary btn-sm" to={`/films/${film.fi_id}`}>Voir les séances</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default FilmsPage;