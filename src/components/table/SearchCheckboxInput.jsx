import React from 'react';

const SearchCheckboxInput = ({ id, name, checked, onChange }) => {
    return (
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
    );
};

export default React.memo(SearchCheckboxInput);
