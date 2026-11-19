import { useContext } from 'react';
import { Navigate } from 'react-router';
import AuthContext from '../Contexts/AuthContext';

const AdminWrapper = ({ children }) => {
    const { isConnected, user } = useContext(AuthContext);

    if (!isConnected) {
        return <Navigate to="/login" />;
    }

    if (user?.us_role !== 'admin') {
        return <Navigate to="/" />;
    }
    return children;
};

export default AdminWrapper;