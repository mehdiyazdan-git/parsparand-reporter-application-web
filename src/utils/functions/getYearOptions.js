import axios from "axios";

/***
 the getYearOptions function is an asynchronous function that returns an array of years.
 it is used to preload the year options and set the default value to the current year.
 it is placed outside the AnnualReport component to avoid re-rendering the component.
 ***/
const getYearOptions = async () => {
    return await axios.get(`http://localhost:9090/api/years/select`)
        .then(res => res.data);
}
export default getYearOptions;
