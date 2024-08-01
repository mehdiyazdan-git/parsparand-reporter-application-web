
import axios from 'axios';
import { BASE_URL } from '../config/config';


const validateEntityName = (name) => {
    if (name === undefined) throw new Error('Entity name is required');
    if (typeof name !== 'string') throw new Error('Entity name must be a string');
    if (name.trim() === '') throw new Error('Entity name cannot be empty');
    if (!name.match(/^[a-zA-Z0-9_]+$/)) throw new Error('Entity name can only contain letters, numbers, and underscores');
    if (name.length > 50) throw new Error('Entity name cannot be longer than 50 characters');
    return true;
};

const http = axios.create({ baseURL: BASE_URL });

http.interceptors.request.use(request => {
    request.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    request.headers['Content-Type'] = 'application/json';
    return request;
}, error => Promise.reject(error));


const useFetchData = (entityName) => {



    const getUrl = (entityName) => {
        if (entityName.endsWith('s')) {
            return `${BASE_URL}/${entityName}`;
        } else {
            return `${BASE_URL}/${entityName}s`;
        }
    }


    const fetchData = async (params) => {
        const isValid = validateEntityName(entityName);

    if (!isValid) throw new Error('Invalid entity name');
       if (params) {
            return await http.get(`${getUrl(entityName)}?${params}`);
        } else {
            return await http.get(getUrl(entityName))
    }}

    const create = async (data) => {
        return await http.post(getUrl(entityName), data);
    }
    const update = async ( id, data) => {
        await http.put(`${getUrl(entityName)}/${id}`, data);
    }
    const remove = async ( id) => {
        await http.delete(`${getUrl(entityName)}/${id}`);
    }


    return {
        fetchData,
        useFetchData,
        create,
        update,
        remove
    }
}
export default useFetchData;
