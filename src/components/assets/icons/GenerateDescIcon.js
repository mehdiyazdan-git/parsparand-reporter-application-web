
import * as React from "react";

function GenerateDescIcon(props) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            height="1em"
            width="1em"
            {...props}
        >
            <path
                fill="currentColor"
                d="M15.909 4.561l-4.47-4.47c-.146-.146-.338-.113-.427.073l-.599 1.248 4.175 4.175 1.248-.599c.186-.089.219-.282.073-.427zM9.615 2.115L5.5 2.458c-.273.034-.501.092-.58.449v.001C3.804 8.268 0 13.499 0 13.499l.896.896 4.25-4.25a1.5 1.5 0 11.707.707l-4.25 4.25.896.896s5.231-3.804 10.591-4.92h.001c.357-.078.415-.306.449-.58l.343-4.115-4.269-4.269z"
            />
        </svg>
    );
}

export default GenerateDescIcon;