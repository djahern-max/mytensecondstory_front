import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../utils/apiService';
import OAuthButtons from './OAuthButtons';
import styles from '../../styles/Auth.module.css';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        full_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Create a copy of formData without confirmPassword
            const { confirmPassword, ...registrationData } = formData;

            await authService.register(registrationData);
            // After registration, log the user in
            await authService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Create Account</h1>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={styles.formInput}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="full_name" className={styles.formLabel}>Full Name</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            className={styles.formInput}
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.formLabel}>Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={styles.formInput}
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="johndoe"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={styles.formInput}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={styles.formInput}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength="8"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <OAuthButtons colorfulMode={true} buttonText="Sign up with" />

                <div className={styles.formFooter}>
                    Already have an account? <Link to="/login" className={styles.formLink}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;