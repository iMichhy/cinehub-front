import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import filmServices from '../Services/filmServices';
import reservationServices from '../Services/reservationServices';


const FilmDetailPage = () => {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [seats, setSeats] = useState(1);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await filmServices.getById(id);
                setFilm(response.data);
            } catch (error) {
                setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger le film." });
            }
        };
        load();
    }, [id]);

    const reserve = async (screeningId) => {
        setMessage(null);
        try {
            await reservationServices.insert({ screening: screeningId, seats: Number(seats) });
            setMessage({ type: "success", text: "Réservation effectuée !" });
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La réservation a échoué." });
        }
    };

    if (!film) {
        return <main className="container">{message && <div className={`alert alert-${message.type}`}>{message.text}</div>}</main>;
    }

    return (
        <main className="container">
            <h1 className="h2">{film.fi_title}</h1>
            <p className="text-muted">{film.fi_genre} · {film.fi_duration} min · sortie le {String(film.fi_release_date).slice(0, 10)}</p>
            <p>{film.fi_description}</p>

            <h2 className="h4 mt-4">Prochaines séances</h2>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}

            <div className="d-flex align-items-center gap-2 mb-3">
                <label htmlFor="seats" className="form-label mb-0">Places</label>
                <input id="seats" type="number" min="1" className="form-control w-auto"
                    value={seats} onChange={(e) => setSeats(e.target.value)} />
            </div>

            {film.screenings.length === 0 ? (
                <p>Aucune séance à venir.</p>
            ) : (
                <table className="table table-striped align-middle">
                    <thead><tr><th>Date</th><th>Salle</th><th>Prix</th><th></th></tr></thead>
                    <tbody>
                        {film.screenings.map((sc) => (
                            <tr key={sc.sc_id}>
                                <td>{sc.sc_datetime}</td>
                                <td>{sc.ro_name}</td>
                                <td>{sc.sc_price} €</td>
                                <td className="text-end">
                                    <button className="btn btn-primary btn-sm" onClick={() => reserve(sc.sc_id)}>Réserver</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default FilmDetailPage;