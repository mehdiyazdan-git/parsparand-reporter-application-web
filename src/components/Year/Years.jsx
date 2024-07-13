import React, { useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../../utils/CrudComponent';
import CreateYearForm from './CreateYearForm';
import EditYearForm from './EditYearForm';

const Years = () => {
    const yearColumns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '10%', sortable: true },
        { key: 'name', title: 'نام سال', width: '80%', sortable: true, searchable: true },
    ], []);

    return (
        <CrudComponent
            url={'/years'}
            entityName="years"
            columns={yearColumns}
            createForm={<CreateYearForm />}
            editForm={<EditYearForm />}
            hasSubTotal={false}
            hasYearSelect={false}
        />
    );
};

export default React.memo(Years);
