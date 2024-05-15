import React from 'react';

const SearchInput = ({ width, id, name, value, onChange, placeholder = "جستجو..." }) => {
    return (
        <th width={width}>
            <input
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
