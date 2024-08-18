import React from "react"
import {FormProvider, useForm} from "react-hook-form"


export function Form({ defaultValues, children, onSubmit,resolver }) {
    const methods
        = useForm({ defaultValues,resolver });
    const {
        handleSubmit,
        register,
        control,
        formState: {errors}
    } = methods;
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}

            >
                {React.Children.map(children, child => {
                    return child.props.name
                        ? React.createElement(child.type, {
                            ...{
                                ...child.props,
                                register: register,
                                control : control,
                                errors :errors,
                                key: child.props.name
                            }
                        })
                        : child;
                })}
            </form>
        </FormProvider>
    );
}
