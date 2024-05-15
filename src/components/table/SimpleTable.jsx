import React from 'react';
import IconEdit from '../assets/icons/IconEdit';
import IconDeleteOutline from '../assets/icons/IconDeleteOutline';
import ConfirmationModal from './ConfirmationModal';

const SimpleTable = ({ columns, data, onEdit, onDelete }) => {
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);

    console.log(data)

    const handleDeleteConfirm = () => {
        if (selectedItem) {
            onDelete(selectedItem);
            setShowConfirmationModal(false);
            setSelectedItem(null);
        }
    };

    return (
        <>
            <table  className="recipient-table table-fixed-height mt-3 w-50">
                <thead style={{fontFamily:"IRANSans", fontSize:"0.8rem"}}>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key}>{column.title}</th>
                    ))}
                    <th>ویرایش / حذف</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id} style={{fontFamily:"IRANSans", fontSize:"0.8rem"}}>
                        {columns.map((column) => (
                            <td key={column.key}>{item[column.key]}</td>
                        ))}
                        <td style={{ padding: '0px' }}>
                            <IconEdit
                                style={{ margin: '0px 10px', cursor: 'pointer' }}
                                fontSize={'1rem'}
                                color="green"
                                onClick={() => onEdit(item)}
                            />
                            <IconDeleteOutline
                                style={{ cursor: 'pointer' }}
                                size={'1.5rem'}
                                onClick={() => {
                                    setSelectedItem(item.id);
                                    setShowConfirmationModal(true);
                                }}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleConfirm={handleDeleteConfirm}
            />
        </>
    );
};

export default SimpleTable;
