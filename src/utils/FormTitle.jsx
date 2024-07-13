// File: FormTitle.jsx
import React, { useRef, useEffect, useState } from 'react';

const FormTitle = ({ title , idPrefix = 'form-title',contractNumber, separator = '-', styleOverrides = {} }) => {


    const containerRef = useRef(null);
    const [parentWidth, setParentWidth] = useState(0);

    useEffect(() => {
        const updateParentWidth = () => {
            const parent = containerRef.current.parentElement.parentElement;
            if (parent) {
                const computedStyle = window.getComputedStyle(parent);
                const paddingLeft = parseFloat(computedStyle.paddingLeft);
                const paddingRight = parseFloat(computedStyle.paddingRight);
                setParentWidth(parent.offsetWidth - paddingLeft - paddingRight);
            }
        };

        updateParentWidth();
        window.addEventListener('resize', updateParentWidth);
        return () => window.removeEventListener('resize', updateParentWidth);
    }, []);

    const defaultStyles = {
        width: `${parentWidth * 0.6}px`,
        height: '2.5rem',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: '10px',
        margin: '0.2rem 0',
        padding: '0.5rem',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'right',
        direction: 'rtl',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '#3b7c1d',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div
            ref={containerRef}
            id={`${idPrefix}-container`}
            className="col-12 mx-2"
            style={{ ...defaultStyles, ...styleOverrides }}
        >
            <div
                id={`${idPrefix}-title`}
                style={{
                    fontFamily: 'IRANSansBold',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    width: '100%',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'block',
                    boxSizing: 'border-box',
                    borderRadius: '10px',
                }}
            >
                {title}
            </div>
        </div>
    );
};

export default FormTitle;
