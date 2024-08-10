
const serializeParams = (params) => {
    return Object.keys(params)
        .map((key) => {
            if (Array.isArray(params[key])) {
                return params[key].map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
            } else if (typeof params[key] === 'object') {
                return Object.keys(params[key]).map((subKey) => `${encodeURIComponent(key)}[${subKey}]=${encodeURIComponent(params[key][subKey])}`).join('&');
            } else if (params[key] !== null && params[key] !== undefined) {
                return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
            } else if (params[key] === null || params[key] === undefined) {
                return `${encodeURIComponent(key)}=${encodeURIComponent('')}`;
            } else {
                return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
            }
        })
        .join('&');
}
export default serializeParams;