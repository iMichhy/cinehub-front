import { useEffect, useState } from 'react';
import reservationServices from '../Services/reservationServices';


const MyReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [message, setMessage] = useState(null);

    const load = async () => {
        try {
            const response = await reservationServices.getMe();
            setReservations(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger vos réservations." });
        }
    };

    useEffect(() => { load(); }, []);

    const cancel = async (id) => {
        if (!window.confirm("Annuler cette réservation ?")) return;
        setMessage(null);
        try {
            await reservationServices.deleteReservation(id);
            setMessage({ type: "success", text: "Réservation annulée." });
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "L'annulation a échoué." });
        }
    };

    return (
        <main className="container">
            <h1 className="h2 mb-3">Mes réservations</h1>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
            {reservations.length === 0 ? (
                <p>Vous n'avez aucune réservation.</p>
            ) : (
                <table className="table table-striped align-middle">
                    <thead><tr><th>Film</th><th>Date</th><th>Salle</th><th>Places</th><th>Prix / place</th><th></th></tr></thead>
                    <tbody>
                        {reservations.map((re) => (
                            <tr key={re.re_id}>
                                <td>{re.fi_title}</td>
                                <td>{re.sc_datetime}</td>
                                <td>{re.ro_name}</td>
                                <td>{re.re_seats}</td>
                                <td>{re.sc_price} €</td>
                                <td className="text-end">
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => cancel(re.re_id)}>Annuler</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default MyReservationsPage;