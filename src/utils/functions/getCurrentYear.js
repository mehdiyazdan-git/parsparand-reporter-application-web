
export default function getCurrentYear() {
    return new Intl.DateTimeFormat('fa-IR').format(new Date()).substring(0,4);
}
