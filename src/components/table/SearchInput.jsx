import React from 'react';

const SearchInput = ({ width, id, name, value, onChange, placeholder = "جستجو..." }) => {
    return (
        <th width={width} className="p-0">
            <input
                style={{ width: `${width}px`, padding: '0.3rem', borderRadius: '0.5rem'}}
                className="table-search-input"
                type="search"
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </th>
    );
};

export default React.memo(SearchInput);
