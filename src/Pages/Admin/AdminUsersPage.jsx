import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../Contexts/AuthContext';
import userServices from '../../Services/userServices';

const AdminUsersPage = () => {
    const { user: me } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState(null);

    const load = async () => {
        try {
            const response = await userServices.getAll();
            setUsers(response.data);
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger les utilisateurs." });
        }
    };

    useEffect(() => { load(); }, []);

    const remove = async (id) => {
        if (!window.confirm("Supprimer cet utilisateur (et ses réservations) ?")) return;
        try {
            await userServices.deleteUser(id);
            load();
        } catch (error) {
            setMessage({ type: "danger", text: error?.response?.data?.error || "La suppression a échoué." });
        }
    };

    return (
        <main className="container">
            <h1 className="h2 mb-3">Utilisateurs</h1>
            {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
            <table className="table table-striped align-middle">
                <thead><tr><th>Username</th><th>Email</th><th>Rôle</th><th></th></tr></thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.us_id}>
                            <td>{u.us_username}</td>
                            <td>{u.us_email}</td>
                            <td><span className={`badge ${u.us_role === 'admin' ? 'text-bg-warning' : 'text-bg-secondary'}`}>{u.us_role}</span></td>
                            <td className="text-end">
                                {u.us_id !== me?.us_id && (
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => remove(u.us_id)}>Supprimer</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default AdminUsersPage;
