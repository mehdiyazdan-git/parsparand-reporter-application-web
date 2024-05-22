import moment from "jalali-moment";

export const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};
