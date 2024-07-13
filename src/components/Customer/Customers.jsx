import React from 'react';
import EditCustomerForm from "./EditCustomerForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateCustomerForm from "./CreateCustomerForm";
import CrudComponent from "../../utils/CrudComponent";

const Customers = () => {
    const customerColumns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'name', title: 'نام', width: '15%', sortable: true, searchable: true },
        { key: 'phone', title: 'تلفن', width: '15%', sortable: true, searchable: true },
        { key: 'customerCode', title: 'کد مشتری', width: '15%', sortable: true, searchable: true },
        { key: 'economicCode', title: 'کد اقتصادی', width: '15%', sortable: true, searchable: true },
        { key: 'nationalCode', title: 'کد ملی', width: '15%', sortable: true, searchable: true },
        {
            key: 'bigCustomer',
            title: 'مشتری بزرگ',
            width: '10%',
            sortable: true,
            searchable: true,
            type: 'checkbox',
            render: (item) => item.bigCustomer ? 'بله' : 'خیر'
        },
    ];

    return (
        <CrudComponent
            url={'/customers'}
            entityName="customers"
            columns={customerColumns}
            createForm={<CreateCustomerForm />}
            editForm={<EditCustomerForm />}
        />
    );
};

export default Customers;
