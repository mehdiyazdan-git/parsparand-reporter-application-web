import {useCallback, useEffect, useRef, useState} from 'react';

const useDeepObjectComparator = (obj) => {
    // Deep comparison function
    const deepEquals = useCallback((object1, object2) => {
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
    },[])

    const [state, setState] = useState(obj);
    const prevObjRef = useRef(obj);

    useEffect(() => {
        if (!deepEquals(prevObjRef.current, obj)) {
            prevObjRef.current = obj;
            setState(obj);
        }
    }, [obj, deepEquals]);

    return state;
};

export default useDeepObjectComparator;
