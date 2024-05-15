import { useEffect, useRef } from 'react';

function useDeepCompareEffect(callback, dependencies) {
    const currentDependenciesRef = useRef();

    if (!isEqual(currentDependenciesRef.current, dependencies)) {
        currentDependenciesRef.current = dependencies;
    }

    useEffect(callback, [currentDependenciesRef.current]);
}

function isEqual(objA, objB) {
    return JSON.stringify(objA) === JSON.stringify(objB);
}

export default useDeepCompareEffect;
