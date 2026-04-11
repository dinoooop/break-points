import React from "react";

export interface OptionItem {
    label: string;
    value: number | string;
}

interface CheckboxProps {
    name: string;
    fieldSet: Record<string, any>;
    formValues: Record<string, any>;
    onChangeForm: (name: string, value: any) => void;
    errors?: Record<string, string>;
    options?: OptionItem[];
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    name,
    fieldSet,
    formValues,
    onChangeForm,
    errors,
    options = [],
    className = "form-control",
}) => {

    if (!fieldSet[name]) {
        throw new Error(`${name} not found`);
    }
    const newId = fieldSet[name].id;
    const newLabel = fieldSet[name].label;
    const values = formValues[name] ?? [];
    console.log(values);

    const error = errors && errors[name] ? errors[name] : "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // check value exist in values
        let newValues = [...values];
        if (newValues.includes(value)) {
            newValues = newValues.filter((v) => v !== value);
        } else {
            newValues.push(value);
        }
        onChangeForm(name, newValues);
    };

    const includesValue = (arr: Array<string | number>, val: number | string) =>
        arr.some((v) => String(v) === String(val));

    return (
        <div className="form-group">
            <label htmlFor={newId}>{newLabel}</label>
            {options.map(({ value, label }) => (
                <label className="checkbox-control" key={value}>
                    <input
                        type="checkbox"
                        value={value}
                        name={name}
                        className={className}
                        onChange={handleChange}
                        checked={includesValue(values, value)}
                    />{" "}
                    {label}
                </label>
            )
            )}
            {error && <div className="color-red">{error}</div>}
        </div>
    );
};

export default Checkbox;
