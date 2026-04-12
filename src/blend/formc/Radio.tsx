import React from "react";

export interface OptionItem {
    label: string;
    value: number | string;
}

interface RadioFieldProps {
    name: string;
    fieldSet: Record<string, any>;
    formValues: Record<string, any>;
    onChangeForm: (name: string, value: any) => void;
    errors: Record<string, string>;
    options?: OptionItem[];
    showEmpty?: boolean;
    className?: string;
}


const Radio: React.FC<RadioFieldProps> = ({
    name,
    fieldSet,
    formValues,
    onChangeForm,
    errors,
    options = [],
}) => {

    if (!fieldSet[name]) {
        throw new Error(`${name} not found`);
    }

    const newId = fieldSet[name].id;
    const newLabel = fieldSet[name].label;

    let value = formValues[name] ?? "";

    // Handle case where value is an object (e.g., from a select component)
    if (value && value.id) {
        onChangeForm(name, value.id);
    }

    const error = errors[name] ?? "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeForm(name, e.target.value);
    };

    return (
        <div className="radio-form-group">
            {newLabel && <label htmlFor={newId} className="main-label">{newLabel}</label>}

            {options.map(({ value, label }) => (
                <label className="radio-control" key={value}>
                    <input
                        type="radio"
                        name={name}
                        value={value}
                        checked={formValues[name] === value}
                        onChange={handleChange}
                    />
                    {label}
                </label>

            ))}


            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default Radio;
