import React, { forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const FormDate = forwardRef(({ name, ...props }, ref) => {
    const { field, fieldState } = useController({ name });
    const { register } = useFormContext();
    const { onChange, ...rest } = register(name);

    return (
        <>
            <DatePicker
                value={field.value}
                {...props}
                name={name}
                calendar={persian}
                locale={persian_fa}
                onChange={(date) =>
                    onChange({ target: { name, value: date?.toDate?.() } })
                }
                {...rest}
                ref={ref}
            />
            {fieldState.error && <p>{fieldState.error.message}</p>}
        </>
        );
    });

export default FormDate;
