import { useEffect, useState } from 'react';
import roomServices from '../../Services/roomServices';

const AdminRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({ name: "", capacity: "" });
    const [message, setMessage] = useState(null);

    const load = async () => {
        try {
            const response = await roomServices.getAll();
            setRooms(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger les salles." });
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
            await roomServices.insert({ name: form.name, capacity: Number(form.capacity) });
            setMessage({ type: "success", text: "Salle créée." });
            setForm({ name: "", capacity: "" });
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La création a échoué." });
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Supprimer cette salle (et ses séances) ?")) return;
        try {
            await roomServices.deleteRoom(id);
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La suppression a échoué." });
        }
    };

    return (
        <main className="container">
            <h1 className="h2 mb-3">Administration des salles</h1>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}

            <form className="row g-2 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-5"><input className="form-control" name="name" placeholder="Nom (ex : Salle 4)" value={form.name} onChange={handleChange} required /></div>
                <div className="col-md-4"><input className="form-control" name="capacity" type="number" min="1" placeholder="Capacité" value={form.capacity} onChange={handleChange} required /></div>
                <div className="col-md-3"><button className="btn btn-primary w-100" type="submit">Ajouter</button></div>
            </form>

            <table className="table table-striped align-middle">
                <thead><tr><th>Nom</th><th>Capacité</th><th></th></tr></thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.ro_id}>
                            <td>{room.ro_name}</td>
                            <td>{room.ro_capacity}</td>
                            <td className="text-end"><button className="btn btn-outline-danger btn-sm" onClick={() => remove(room.ro_id)}>Supprimer</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default AdminRoomsPage;