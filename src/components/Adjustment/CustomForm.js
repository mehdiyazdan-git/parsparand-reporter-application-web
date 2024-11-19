import React from 'react';

const CustomForm = ({ children }) => {
    const processChildren = (children, isNested = false) => {
        return React.Children.map(children, (child) => {
            // Return null if child is not valid
            if (!React.isValidElement(child)) {
                return null;
            }

            let newClassName = '';
            let childProps = { ...child.props };

            // Handle div elements
            if (child.type === 'div' || child.type?.name === 'div') {
                // If it's a top-level div, make it a row
                if (!isNested) {
                    newClassName = 'row flex flex-row gap-4 mb-4';

                    // Process children of row div as columns
                    if (child.props.children) {
                        childProps.children = processChildren(child.props.children, true);
                    }
                }
                // If it's a nested div, make it a column
                else {
                    newClassName = 'col flex-1';
                }
            }
            // Handle other input elements
            else {
                newClassName = `${child.type.name || 'default'}Input`;
            }

            // Combine with existing className if any
            const className = child.props.className
                ? `${child.props.className} ${newClassName}`
                : newClassName;

            // If the element has children but is not a div, process them normally
            if (child.props.children && child.type !== 'div' && child.type?.name !== 'div') {
                childProps.children = processChildren(child.props.children, isNested);
            }

            return React.cloneElement(child, {
                ...childProps,
                className
            });
        });
    };

    return (
        <form className="flex flex-col gap-4">
            {processChildren(children)}
        </form>
    );
};

export default CustomForm;

// Example usage:
const ExampleFormUsage = () => {
    const CustomInput = ({ ...props }) => <input {...props} />;
    const CustomSelect = ({ ...props }) => <select {...props} />;
    const CustomTextarea = ({ ...props }) => <textarea {...props} />;

    return (
        <CustomForm>
            <CustomInput type="text" placeholder="Single input" />

            <div>
                <div>
                    <CustomInput type="text" placeholder="Column 1 input" />
                    <CustomSelect>
                        <option>Column 1 select</option>
                    </CustomSelect>
                </div>
                <div>
                    <CustomInput type="text" placeholder="Column 2 input" />
                    <CustomTextarea placeholder="Column 2 textarea" />
                </div>
            </div>

            <div>
                <div>
                    <CustomInput type="text" placeholder="Another row, column 1" />
                </div>
                <div>
                    <CustomInput type="text" placeholder="Another row, column 2" />
                </div>
                <div>
                    <CustomInput type="text" placeholder="Another row, column 3" />
                </div>
            </div>
        </CustomForm>
    );
};