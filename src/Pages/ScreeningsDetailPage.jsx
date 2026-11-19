import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import screeningServices from '../Services/screeningServices';
import reservationServices from '../Services/reservationServices';

const ScreeningDetailPage = () => {
    const { id } = useParams();
    const [screening, setScreening] = useState(null);
    const [seats, setSeats] = useState(1);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await screeningServices.getById(id);
                setScreening(response.data);
            } catch (error) {
                setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger la séance." });
            }
        };
        load();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            await reservationServices.insert({ screening: Number(id), seats: Number(seats) });
            setMessage({ type: "success", text: "Réservation effectuée !" });
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La réservation a échoué." });
        }
    };

    return (
        <main className="container">
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
            {screening && (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h1 className="h3">{screening.fi_title}</h1>
                        <p className="mb-1">{screening.sc_datetime}</p>
                        <p className="mb-1">{screening.ro_name} ({screening.ro_capacity} places)</p>
                        <p>{screening.sc_price} € la place</p>

                        <form className="d-flex align-items-center gap-2" onSubmit={handleSubmit}>
                            <label htmlFor="seats" className="form-label mb-0">Places</label>
                            <input id="seats" type="number" min="1" className="form-control w-auto"
                                value={seats} onChange={(e) => setSeats(e.target.value)} />
                            <button className="btn btn-primary" type="submit">Réserver</button>
                        </form>
                        <Link className="d-inline-block mt-3" to={`/films/${screening.sc_film}`}>Voir le film</Link>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ScreeningDetailPage;