// useAsync.js
import { useCallback, useRef } from "react";

const MESSAGE = {
    initial: "جستجو...",
    noOption: "هیچ موردی یافت نشد.",
    networkError: "خطای شبکه. مجددا سعی نمایید."
};

export default function useAsync(loadOptionFn) {
    const messageRef = useRef(MESSAGE.noOption);
    let timer = useRef();


    const loadOptions = (keyword, callback) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            loadOptionFn(keyword)
                .then((options) => {
                    if (!options?.length) {
                        messageRef.current = MESSAGE.noOption;
                    }
                    callback(options);
                })
                .catch((err) => {
                    messageRef.current = MESSAGE.networkError;
                    callback([]);
                });
        }, 300);
    };

    return {
        noOptionMessages: useCallback(
            ({ inputValue }) => (inputValue ? messageRef.current : MESSAGE.initial),
            [messageRef]
        ),
        loadOptions: loadOptions
    };

}
