import React from 'react';

const FooterNumber = ({ number }) => {
    const formatNumber = (value) => {
        // Format the number with commas
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const styles = {
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '38px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        textIndent: "0.5rem",
        padding: "0.1rem",
        borderRadius: "0.25rem",
        fontSize: "0.78rem",
        fontWeight: "bold",
        lineHeight: "1.0rem",
        color: "#334155",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <div style={styles}>
            <input
                type="text"
                value={formatNumber(number)}
                style={styles}
            />
        </div>
    );
};

export default FooterNumber;