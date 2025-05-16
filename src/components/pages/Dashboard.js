import React, { useEffect, useState } from 'react';
import { userService, authService } from '../../utils/apiService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.getCurrentUser();
                setUser(response.data);
            } catch (err) {
                setError('Failed to load user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    if (loading) {
        return <div className="dashboard loading">Loading...</div>;
    }

    if (error) {
        return <div className="dashboard error">{error}</div>;
    }

    return (
        <div className="dashboard">
            <header>
                <h1>Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <section className="user-info">
                <h2>Welcome, {user?.full_name || user?.username || 'User'}!</h2>
                <p>Email: {user?.email}</p>
            </section>

            <section className="video-section">
                <h2>Your Videos</h2>
                <p>You haven't created any videos yet. Get started by creating your first 10-second story!</p>
                <button>Create New Video</button>
            </section>
        </div>
    );
};

export default Dashboard;