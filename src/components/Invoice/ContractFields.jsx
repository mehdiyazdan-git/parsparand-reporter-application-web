import React from 'react';
import {useFormContext, useWatch} from "react-hook-form";

const ContractFields = ({ children }) => {

    const {control} = useFormContext();
    const salesType = useWatch({ control, name: "salesType" });
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
