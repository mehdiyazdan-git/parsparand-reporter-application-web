import { useEffect, useState } from 'react';

/**
 * Custom hook to deeply compare an object and trigger a re-render
 * if the object changes.
 * @param obj - The object to watch for changes.
 * @returns The current state of the object.
 */
const useDeepObjectComparator = (obj) => {
    // Deep comparison function
    const deepEquals = (object1, object2) => {
        // Identity
        if (object1 === object2) {
            return true;
        }

        // Compare objects
        if (typeof object1 === 'object' && object1 !== null && typeof object2 === 'object' && object2 !== null) {
            const keys1 = Object.keys(object1);
            const keys2 = Object.keys(object2);
            return keys1.length === keys2.length && keys1.every(key => deepEquals(object1[key], object2[key]));
        }

        // Compare primitives
        return object1 === object2;
    };

    const [state, setState] = useState(obj);

    useEffect(() => {
        if (!deepEquals(state, obj)) {
            setState(obj);
        }
    }, [obj, state]);

    return state;
};

export default useDeepObjectComparator;
