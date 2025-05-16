import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const provider = location.pathname.split('/').pop(); // e.g., 'google'

            if (!code) {
                setError('Authorization code is missing');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/api/v1/auth/${provider}/callback`, {
                    params: { code }
                });

                // Store tokens
                const { access_token, refresh_token } = response.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);

                // Redirect to dashboard
                navigate('/dashboard');
            } catch (err) {
                setError('Authentication failed. Please try again.');
                setLoading(false);
            }
        };

        handleCallback();
    }, [location, navigate]);

    if (loading) {
        return <div className="oauth-callback">Processing authentication...</div>;
    }

    if (error) {
        return (
            <div className="oauth-callback error">
                <h2>Authentication Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/login')}>Back to Login</button>
            </div>
        );
    }

    return null; // Component will redirect to dashboard if successful
};

export default OAuthCallback;