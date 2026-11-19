import { useEffect, useState } from 'react';
import screeningServices from '../../Services/screeningServices';
import filmServices from '../../Services/filmServices';
import roomServices from '../../Services/roomServices';

const emptyForm = { film: "", room: "", datetime: "", price: "" };

const AdminScreeningsPage = () => {
    const [screenings, setScreenings] = useState([]);
    const [films, setFilms] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [message, setMessage] = useState(null);

    const load = async () => {
        try {
            const [sc, fi, ro] = await Promise.all([
                screeningServices.getAll(),
                filmServices.getAll(),
                roomServices.getAll()
            ]);
            setScreenings(sc.data);
            setFilms(fi.data);
            setRooms(ro.data);
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger les données." });
        }
    };

    useEffect(() => { load(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await screeningServices.insert({
                film: Number(form.film),
                room: Number(form.room),
                datetime: form.datetime.replace('T', ' ') + ':00',
                price: Number(form.price)
            });
            setMessage({ type: "success", text: "Séance créée." });
            setForm(emptyForm);
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La création a échoué." });
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Supprimer cette séance (et ses réservations) ?")) return;
        try {
            await screeningServices.deleteScreening(id);
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La suppression a échoué." });
        }
    };

    return (
        <main className="container">
            <h1 className="h2 mb-3">Administration des séances</h1>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}

            <form className="row g-2 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-3">
                    <select className="form-select" name="film" value={form.film} onChange={handleChange} required>
                        <option value="">Film…</option>
                        {films.map((f) => <option key={f.fi_id} value={f.fi_id}>{f.fi_title}</option>)}
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-select" name="room" value={form.room} onChange={handleChange} required>
                        <option value="">Salle…</option>
                        {rooms.map((r) => <option key={r.ro_id} value={r.ro_id}>{r.ro_name}</option>)}
                    </select>
                </div>
                <div className="col-md-3"><input className="form-control" name="datetime" type="datetime-local" value={form.datetime} onChange={handleChange} required /></div>
                <div className="col-md-2"><input className="form-control" name="price" type="number" min="0" step="0.01" placeholder="Prix (€)" value={form.price} onChange={handleChange} required /></div>
                <div className="col-md-2"><button className="btn btn-primary w-100" type="submit">Ajouter</button></div>
            </form>

            <table className="table table-striped align-middle">
                <thead><tr><th>Film</th><th>Date</th><th>Salle</th><th>Prix</th><th></th></tr></thead>
                <tbody>
                    {screenings.map((sc) => (
                        <tr key={sc.sc_id}>
                            <td>{sc.fi_title}</td>
                            <td>{sc.sc_datetime}</td>
                            <td>{sc.ro_name}</td>
                            <td>{sc.sc_price} €</td>
                            <td className="text-end"><button className="btn btn-outline-danger btn-sm" onClick={() => remove(sc.sc_id)}>Supprimer</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default AdminScreeningsPage;