import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

let cache = new Map();

const useFakeFetch = (URL) => {
    let location = useLocation();
    let navigate = useNavigate();
    // Extract query parameters using URLSearchParams
    let queryParams = new URLSearchParams(location.search);
    let paramsObject = {};
    queryParams.forEach((value, key) => {
        paramsObject[key] = value;
    });

    // Store query params in location.state
    useEffect(() => {
        navigate(location.pathname, { state: paramsObject, replace: true });
    }, [location.search]);

    let cacheKey = location.key + URL + location.search;
    let cached = cache.get(cacheKey);

    let [data, setData] = useState(() => {
        // Initialize from the cache
        return cached || null;
    });

    let [state, setState] = useState(() => {
        // Avoid the fetch if cached
        return cached ? "done" : "loading";
    });

    useEffect(() => {
        if (state === "loading") {
            let controller = new AbortController();
            fetch(URL, { signal: controller.signal })
                .then((res) => res.json())
                .then((data) => {
                    if (controller.signal.aborted) return;
                    // Set the cache with query parameters
                    cache.set(cacheKey, data);
                    setData(data);
                });
            return () => controller.abort();
        }
    }, [state, cacheKey]);

    useEffect(() => {
        setState("loading");
    }, [URL, location.search]); // Add location.search as a dependency

    return data;
};

export default useFakeFetch;
