import React from 'react';

const SearchCheckboxInput = ({ width, id, name, checked, onChange }) => {
    return (
        <th width={width}>
            <label>
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    style={{ margin: '0.5rem' }}
                />
                بلی
            </label>
        </th>
    );
};

export default React.memo(SearchCheckboxInput);
