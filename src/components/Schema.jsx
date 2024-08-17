//useHttp
import axios from "axios";
import {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {ModalBody} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

const Schema = () => {

    const personColumns = useState([
        {key: 'id', title: 'ID', searchable: true, sortable: true},
        {key: 'name', title: 'Name', searchable: true, sortable: true},
        {key: 'birthDate', title: 'Birth Date', searchable: true, sortable: true},
        {key: 'age', title: 'Age', searchable: true, sortable: true},
    ]);


//useTable
    const useTable = ({data, columns,baseUrl}) => {

        const {filter, setFilter} = useFilter();
        const [data, setData] = useState([]);


        const [totalPages, setTotalPages] = useState(0);
        const [totalElements, setTotalElements] = useState(0);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const handleSearch = (e) => setFilter({...filter, search: {...filter.search, [e.target.name]: e.target.value}});
        const handleSort = (sortBy, sortOrder) => setFilter({
            ...filter,
            sort: {...filter.sort, 'sortBy': sortBy, [sortOrder]: sortOrder}
        });
        const handlePageChange = (page) => setFilter({...filter, pageable: {...filter.pageable, 'page': page}});
        const handleSizeChange = (size) => setFilter({...filter, pageable: {...filter.pageable, 'size': size}})


        const fetchData = async () => {
            setLoading(true);
            const params = Object.keys(filter).map(key => `${key}=${encodeURIComponent(filter[key])}`).join('&');
            try {
                const response = await this.useHttp().get('/api/data', {params});
                setData(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
                setLoading(false);

            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }

        return {
            data,
            columns,
            filter,
            handleSearch,
            handleSort,
            handlePageChange,
            handleSizeChange,
            fetchData,
            totalPages,
            totalElements,
            loading,
            error
        };
    }
    const Table = ({listName,columns,data,pagination,newForm,editForm}) => {
        const {getAll, getOne, post, put, del} = useHttp();
        const {
            filter,
            dataSet,
            handleSearch,
            handleSort,
            handlePageChange,
            handleSizeChange,
            fetchData,
            totalPages,
            totalElements,
            loading,
            error
        } = useTable({listName, columns,});




        return (
            <>
                <table>
                    <thead>
                    <tr>
                       {/*implement table headers with sort for corresponding column if sortable =true*/}
                    </tr>
                    <tr>
                        {/* implement search box for corresponding column if searchable =true  */}
                    </tr>
                    </thead>

                    <tbody>
                    <CreateForm/>
                    {/*implement table body*/}
                    </tbody>
                    <tfoot>
                        {/*implement pagination here */}
                    </tfoot>
                </table>
            </>
        )
    }

    const CreateForm = ({show, onClose, onCreate}) => {
        const {register,
            handleSubmit
        } = useForm({
            defaultValues : {'name' : '', 'birthDate' : '', 'age': ''}
        })
        const onSubmit = (data) => {
            console.log(data);
        }

        return (
            <Modal show={show}>
                <ModalBody>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label htmlFor='name'> Name
                                <input id='name' name='name' {...register('name')}/>
                            </label>
                            <label htmlFor='birthDate'> Name
                                <input id='birthDate' name='birthDate' {...register('birthDate')}/>
                            </label>
                            <label htmlFor='age'> Name
                                <input id='age' name='age' {...register('age')}/>
                            </label>
                            <input type='submit'/>
                        </form>
                    </div>

                </ModalBody>
            </Modal>
        );

    }
    const EditForm = ({editingData, show, onClose, onEdit}) => {


    }
}
            
    
        


