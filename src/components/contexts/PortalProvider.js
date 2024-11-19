// PortalProvider.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const PortalProvider = ({ children }) => {
    const [portalContainer, setPortalContainer] = React.useState(null);

    useEffect(() => {
        const div = document.createElement('div');
        div.id = 'portal-root';
        document.body.appendChild(div);
        setPortalContainer(div);

        return () => {
            document.body.removeChild(div);
        };
    }, []);

    if (!portalContainer) return null;

    return ReactDOM.createPortal(children, portalContainer);
};

export default PortalProvider;
