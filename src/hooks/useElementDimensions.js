import { useState, useEffect, useRef } from 'react';

function useElementDimensions() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            const observer = new ResizeObserver((entries) => {
                if (entries.length > 0) {
                    const { width, height } = entries[0].contentRect;
                    setDimensions({ width, height });
                }
            });

            observer.observe(element);

            return () => {
                if (observer) {
                    observer.disconnect();
                }
            };
        }
    }, []);

    return [ref, dimensions];
}

export default useElementDimensions;