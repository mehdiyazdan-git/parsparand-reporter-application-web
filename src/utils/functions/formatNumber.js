export const formatNumber = (number) => {
    try {
        if (number === null || number === undefined) {
            return "";
        }

        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (error) {
        console.error(error.message);
        return "";
    }
};
