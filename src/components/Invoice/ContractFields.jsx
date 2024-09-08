import React, {useCallback, useEffect} from 'react';
import {useFormContext, useWatch} from "react-hook-form";
/***
 The ContractFields React component conditionally renders child components based on a “salesType” form field.
 It dynamically shows or hides specific form elements related to contractual sales,
 maintaining a consistent structure regardless of whether the children are rendered.
 ***/
const ContractFields = ({ children,onSalesTypeChange }) => {




    const {control} = useFormContext();
    const salesType = useWatch({ control, name: "salesType" });

    useEffect(() => {
        onSalesTypeChange(salesType);
    }, [salesType, onSalesTypeChange]);
    return (
        <div>
            {salesType === 'CONTRACTUAL_SALES'
                &&
                React.Children.map(children, child => {
                    return child.props.name
                        ? React.createElement(child.type, {
                            ...{...child.props,}
                        })
                        : child;
                })
            }
        </div>
    );
};

export default ContractFields;
