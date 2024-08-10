import React, { useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../contexts/CrudComponent';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';

const Users = () => {
    const userColumns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'username', title: 'نام کاربری', width: '15%', sortable: true, searchable: true },
        { key: 'email', title: 'ایمیل', width: '20%', sortable: true, searchable: true },
        { key: 'enabled', title: 'فعال', width: '10%', sortable: true, searchable: true, render: (item) => item.enabled ? 'بله' : 'خیر' },
        { key: 'firstname', title: 'نام', width: '15%', sortable: true, searchable: true },
        { key: 'lastname', title: 'نام خانوادگی', width: '15%', sortable: true, searchable: true },
        { key: 'role', title: 'نقش', width: '10%', sortable: true, searchable: true },
    ], []);

    return (
        <CrudComponent
            url={'/users'}
            entityName="users"
            columns={userColumns}
            createForm={<CreateUserForm />}
            editForm={<EditUserForm />}
            hasSubTotal={false}
            hasYearSelect={false}
        />
    );
};

export default React.memo(Users);
