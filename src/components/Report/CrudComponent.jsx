import React from 'react';
import {useData} from "../contexts/DataContext";
import Table from "../table/Table";

const CrudComponent = ({entityName}) => {
    const {data} = useData(entityName)
    const columns = ['....']
    return (
        <div>
            <Table
                columns={columns}
                url={'/url'}
                data={data}
                />

        </div>
    );
};

export default CrudComponent;
