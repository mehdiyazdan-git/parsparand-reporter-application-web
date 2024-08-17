import React from 'react';

const PageSizeSelector = ({size,handleSizeChange}) => {

    return (
        <div className="page-size">
            اندازه صفحه:
            <select onChange={handleSizeChange} value={size}>
                <option key={1} value={5}>{5}</option>
                <option key={2} value={10}>{10}</option>
                <option key={3} value={20}>{20}</option>
            </select>
        </div>
    );
};

export default React.memo(PageSizeSelector);
