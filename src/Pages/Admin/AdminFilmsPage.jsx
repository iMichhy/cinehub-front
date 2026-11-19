import { useEffect, useState } from 'react';
import filmServices from '../../Services/filmServices';

const emptyForm = { title: "", description: "", duration: "", genre: "", release_date: "", is_showing: true };

const AdminFilmsPage = () => {
    const [films, setFilms] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [message, setMessage] = useState(null);

    const load = async () => {
        try {
            const response = await filmServices.getAll();
            setFilms(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger les films." });
        }
    };

    useEffect(() => { load(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await filmServices.insert({
                ...form,
                duration: Number(form.duration),
                release_date: form.release_date || undefined
            });
            setMessage({ type: "success", text: "Film créé." });
            setForm(emptyForm);
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La création a échoué." });
        }
    };

    const toggleShowing = async (film) => {
        try {
            await filmServices.update(film.fi_id, { is_showing: !film.fi_is_showing });
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La modification a échoué." });
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Supprimer ce film (et ses séances) ?")) return;
        try {
            await filmServices.deleteFilm(id);
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La suppression a échoué." });
        }
    };

    return (
        <main className="container">
            <h1 className="h2 mb-3">Administration des films</h1>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}

            <form className="row g-2 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-4"><input className="form-control" name="title" placeholder="Titre" value={form.title} onChange={handleChange} required /></div>
                <div className="col-md-2"><input className="form-control" name="duration" type="number" min="1" placeholder="Durée (min)" value={form.duration} onChange={handleChange} required /></div>
                <div className="col-md-3"><input className="form-control" name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} /></div>
                <div className="col-md-3"><input className="form-control" name="release_date" type="date" value={form.release_date} onChange={handleChange} /></div>
                <div className="col-12"><textarea className="form-control" name="description" placeholder="Description" value={form.description} onChange={handleChange} /></div>
                <div className="col-12 d-flex align-items-center gap-3">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="is_showing" name="is_showing" checked={form.is_showing} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="is_showing">À l'affiche</label>
                    </div>
                    <button className="btn btn-primary" type="submit">Ajouter</button>
                </div>
            </form>

            <table className="table table-striped align-middle">
                <thead><tr><th>Titre</th><th>Genre</th><th>Durée</th><th>À l'affiche</th><th></th></tr></thead>
                <tbody>
                    {films.map((film) => (
                        <tr key={film.fi_id}>
                            <td>{film.fi_title}</td>
                            <td>{film.fi_genre}</td>
                            <td>{film.fi_duration} min</td>
                            <td>
                                <button className={`btn btn-sm ${film.fi_is_showing ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => toggleShowing(film)}>
                                    {film.fi_is_showing ? 'Oui' : 'Non'}
                                </button>
                            </td>
                            <td className="text-end"><button className="btn btn-outline-danger btn-sm" onClick={() => remove(film.fi_id)}>Supprimer</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default AdminFilmsPage;