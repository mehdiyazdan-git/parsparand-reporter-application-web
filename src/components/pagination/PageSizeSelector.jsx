import React from 'react';

const PageSizeSelector = ({size,handleSizeChange}) => {
    const onPageSizeChange = (e) => handleSizeChange(e.target.value);
    return (
        <div className="page-size">
            اندازه صفحه:
            <select onChange={onPageSizeChange} value={size}>
                <option key={1} value={5}>{5}</option>
                <option key={2} value={10}>{10}</option>
                <option key={3} value={20}>{20}</option>
            </select>
        </div>
    );
};

export default React.memo(PageSizeSelector);
