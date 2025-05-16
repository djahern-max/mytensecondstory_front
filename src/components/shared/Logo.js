import React, { useState, useEffect } from 'react';
import styles from './Logo.module.css';
import { Link } from 'react-router-dom';

const Logo = ({
    width = 120,
    className = '',
    linkTo = '/',
    customColors = null,
    triggerAnimation = false,
    onClick = null
}) => {
    // State to track if we should show the extra animation
    const [isAnimating, setIsAnimating] = useState(false);
    const [colorIndices, setColorIndices] = useState({
        my: 0,
        ten: 1,
        second: 2,
        story: 3
    });

    // Default colors if none provided
    const colors = customColors || [
        '#0066cc', // Primary blue
        '#f97316', // Orange accent
        '#111827', // Text primary
        '#1d4ed8'  // Primary dark
    ];

    // Start the animation when the component mounts if trigger is true
    useEffect(() => {
        if (triggerAnimation) {
            setIsAnimating(true);

            // Set up a color cycling interval
            const colorInterval = setInterval(() => {
                setColorIndices(prev => ({
                    my: (prev.my + 1) % colors.length,
                    ten: (prev.ten + 1) % colors.length,
                    second: (prev.second + 1) % colors.length,
                    story: (prev.story + 1) % colors.length
                }));
            }, 2000);

            return () => clearInterval(colorInterval);
        }
    }, [triggerAnimation, colors.length]);

    // Handle click - either use provided handler or trigger animation
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        } else {
            setIsAnimating(true);
            // Reset after animation completes
            setTimeout(() => setIsAnimating(false), 1000);
        }
    };

    // Determine the component (Link or div) based on whether linkTo is provided
    const Component = linkTo ? Link : 'div';
    const linkProps = linkTo ? { to: linkTo } : {};

    return (
        <Component
            {...linkProps}
            className={`${styles.logoLink} ${className}`}
            onClick={handleClick}
        >
            <div className={styles.logoContainer} style={{ width: `${width}px` }}>
                <span
                    className={`${styles.myText} ${isAnimating ? styles.animating : ''}`}
                    style={customColors ? { color: colors[colorIndices.my] } : {}}
                >
                    my
                </span>
                <span
                    className={`${styles.tenText} ${isAnimating ? styles.animating : ''}`}
                    style={customColors ? { color: colors[colorIndices.ten] } : {}}
                >
                    10
                </span>
                <span
                    className={`${styles.secondText} ${isAnimating ? styles.animating : ''}`}
                    style={customColors ? { color: colors[colorIndices.second] } : {}}
                >
                    second
                </span>
                <span
                    className={`${styles.storyText} ${isAnimating ? styles.animating : ''}`}
                    style={customColors ? { color: colors[colorIndices.story] } : {}}
                >
                    story
                </span>
            </div>
        </Component>
    );
};

export default Logo;