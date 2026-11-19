import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import screeningServices from '../Services/screeningServices';


const ScreeningsPage = () => {
    const [screenings, setScreenings] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await screeningServices.getAll();
                setScreenings(response.data);
            } catch (error) {
                setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger les séances." });
            }
        };
        load();
    }, []);

    return (
        <main className="container">
            <h1 className="h2 mb-3">Séances</h1>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
            <table className="table table-striped align-middle">
                <thead><tr><th>Film</th><th>Date</th><th>Salle</th><th>Prix</th><th></th></tr></thead>
                <tbody>
                    {screenings.map((sc) => (
                        <tr key={sc.sc_id}>
                            <td>{sc.fi_title}</td>
                            <td>{sc.sc_datetime}</td>
                            <td>{sc.ro_name}</td>
                            <td>{sc.sc_price} €</td>
                            <td className="text-end">
                                <Link className="btn btn-outline-primary btn-sm" to={`/screenings/${sc.sc_id}`}>Détail</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default ScreeningsPage;