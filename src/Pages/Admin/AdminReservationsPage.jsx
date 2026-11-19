import { useEffect, useState } from 'react';
import reservationServices from '../../Services/reservationServices';


const AdminReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [message, setMessage] = useState(null);

    const load = async () => {
        try {
            const response = await reservationServices.getAll();
            setReservations(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger les réservations." });
        }
    };

    useEffect(() => { load(); }, []);

    const cancel = async (id) => {
        if (!window.confirm("Annuler cette réservation ?")) return;
        try {
            await reservationServices.deleteReservation(id);
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "L'annulation a échoué." });
        }
    };

    return (
        <main className="container">
            <h1 className="h2 mb-3">Toutes les réservations</h1>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
            <table className="table table-striped align-middle">
                <thead><tr><th>Utilisateur</th><th>Film</th><th>Séance</th><th>Salle</th><th>Places</th><th></th></tr></thead>
                <tbody>
                    {reservations.map((re) => (
                        <tr key={re.re_id}>
                            <td>{re.us_username}</td>
                            <td>{re.fi_title}</td>
                            <td>{re.sc_datetime}</td>
                            <td>{re.ro_name}</td>
                            <td>{re.re_seats}</td>
                            <td className="text-end"><button className="btn btn-outline-danger btn-sm" onClick={() => cancel(re.re_id)}>Annuler</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default AdminReservationsPage;