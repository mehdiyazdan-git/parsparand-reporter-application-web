import React from 'react';
import {AppContext} from "../../components/contexts/AppProvider";

const GetYearId = (date) => {

    const {years} = React.useContext(AppContext);
    const jalaliYear = parseInt(new Intl.DateTimeFormat('fa-IR')
        .format(new Date(date)).substring(0, 4), 10);

    return  years.find(year => year.year === jalaliYear).id;
};

export default GetYearId;