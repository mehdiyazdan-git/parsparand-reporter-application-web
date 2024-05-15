import React from 'react';

const ButtonContainer = ({children, lastChild}) => {
    const style = {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adjust shadow properties as needed
        border: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "1em",
        borderRadius: "0.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "1rem"
    };

    return (
        <div style={style}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {children}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {lastChild}
            </div>
        </div>
    );
};

export default ButtonContainer;
