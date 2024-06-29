
export default function toNumberOrNull(input) {
    if (typeof input === 'number') {
        return input;
    } else if (typeof input === 'string' && !isNaN(Number(input))) {
        return Number(input); // Convert valid numeric strings
    }
    return null;
}
