
export default function getCurrentYear() {
    return parseInt(new Intl.DateTimeFormat('fa-IR').format(new Date()).substring(0, 4), 10);
}
