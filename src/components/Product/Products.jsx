import React from 'react';

import EditProductForm from "./EditProductForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateProductForm from "./CreateProductForm";
import CrudComponent from "../../utils/CrudComponent";



const Products = () => {
    const options = [
        { value: 2, label: 'اصلی' },
        { value: 6, label: 'ضایعات' },
        { value: 1, label: 'مواد اولیه' },
    ]
    const convertToPersianCaption = (caption) => {
        const persianCaptions = {
            'MAIN': 'اصلی',
            'SCRAPT': 'ضایعات',
            'RAWMATERIAL': 'مواد اولیه',
        };
        return persianCaptions[caption] || caption;
    };

    const productColumns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'productCode', title: 'کد محصول', width: '15%', sortable: true, searchable: true },
        { key: 'productName', title: 'نام محصول', width: '20%', sortable: true, searchable: true },
        { key: 'measurementIndex', title: 'شاخص اندازه‌گیری', width: '20%', sortable: true, searchable: true },
        {
            key: 'productType',
            title: 'نوع محصول',
            width: '20%',
            sortable: true,
            searchable: true,
            render: (item) => convertToPersianCaption(item.productType),
            type: 'select',
            options: options
        },
    ];
    return (
        <CrudComponent
            url={'/products'}
            entityName="products"
            columns={productColumns}
            createForm={<CreateProductForm />}
            editForm={<EditProductForm />}
        />
    );
};

export default Products;
