import { useEffect, useState } from 'react';
import roomServices from '../Services/roomServices';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await roomServices.getAll();
                setRooms(response.data);
            } catch (error) {
                setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger les salles." });
            }
        };
        load();
    }, []);

    return (
        <main className="container">
            <h1 className="h2 mb-3">Salles</h1>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
            <ul className="list-group">
                {rooms.map((room) => (
                    <li className="list-group-item d-flex justify-content-between" key={room.ro_id}>
                        <span>{room.ro_name}</span>
                        <span className="text-muted">{room.ro_capacity} places</span>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default RoomsPage;