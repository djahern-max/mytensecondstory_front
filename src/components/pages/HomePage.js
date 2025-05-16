import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import OAuthButtons from '../auth/OAuthButtons';
import { Film, Users, Briefcase } from 'lucide-react';

function HomePage() {
    return (
        <div className={styles.fullPage}>
            <div className={styles.centeredContent}>
                {/* Logo with tilted "10" */}
                <div className={styles.logo}>
                    <div className={styles.logoText}>
                        <span className={styles.my}>my</span>
                        <span className={styles.ten}>10</span>
                        <span className={styles.second}>second</span>
                        <br />
                        <span className={styles.story}>story</span>
                    </div>
                </div>

                {/* Subtitle */}
                <div className={styles.subtitle}>
                    Your <span>10-second</span> spotlight <span className={styles.awaits}>awaits</span>
                </div>

                {/* Features Grid with shadow and tilt effects */}
                <div className={styles.featuresGrid}>
                    <div className={styles.featureItem}>
                        <div className={`${styles.featureIcon} ${styles.feature1}`}>
                            <Film size={28} />
                        </div>
                        <div className={styles.featureText}>Create your story</div>
                    </div>

                    <div className={styles.featureItem}>
                        <div className={`${styles.featureIcon} ${styles.feature2}`}>
                            <Users size={28} />
                        </div>
                        <div className={styles.featureText}>Connect quickly</div>
                    </div>

                    <div className={styles.featureItem}>
                        <div className={`${styles.featureIcon} ${styles.feature3}`}>
                            <Briefcase size={28} />
                        </div>
                        <div className={styles.featureText}>Find leads</div>
                    </div>
                </div>

                {/* Buttons with enhanced styling */}
                <div className={styles.buttonGroup}>
                    <Link to="/register" className={styles.primaryButton}>
                        Get Started
                    </Link>
                    <Link to="/login" className={styles.secondaryButton}>
                        Sign In
                    </Link>
                </div>

                {/* Narrower OAuth buttons container */}
                <div className={styles.oauthContainer}>
                    <OAuthButtons colorfulMode={true} />
                </div>
            </div>
        </div>
    );
}

export default HomePage;