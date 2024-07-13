import React from "react";
import PropTypes from "prop-types";
const useToggle = initialValue => {
    const [value, setValue] = React.useState(initialValue);
    const toggle = React.useCallback(() => {
        setValue(v => !v);
    }, []);
    return [value, toggle];
};
useToggle.propsType = {
    initialValue: PropTypes.bool.isRequired
}
export default React.memo(useToggle);
