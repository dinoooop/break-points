import React from "react";

interface InputCurrentReadingProps {
    name: string;
    fieldSet: Record<string, any>;
    formValues: Record<string, any>;
    onChangeForm: (name: string, value: any) => void;
    errors: Record<string, string>;
    disabled?: boolean;
    hideLabel?: boolean;
}

const InputCurrentReading: React.FC<InputCurrentReadingProps> = ({
    name,
    fieldSet,
    formValues,
    errors,
    onChangeForm,
    disabled = false,
    hideLabel = false,
}) => {

    if (!fieldSet[name]) {
        throw new Error(`${name} not found`);
    }

    const newId = fieldSet[name].id;
    const newLabel = fieldSet[name].label;
    const newDescription = fieldSet[name].description?? '';
 
    let value = formValues[name] ?? "";
    // if (value == "") {
    //     value = fieldSet[name].defaultValue ?? "";
    // }
    const error = errors[name] ?? "";
 
    const newType = 'text';
    const firstValueRef = React.useRef<any>(undefined);
    if (firstValueRef.current === undefined && value !== "") {
        firstValueRef.current = value;
    }
    const prevValue = firstValueRef.current;

    const onChangeInputCurrentReading = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeForm(name, e.target.value);
    };

    return (
        <div className="form-group">
            {
                !hideLabel &&
                <label htmlFor={newId}>{newLabel}</label>
            }
            {
                prevValue !== undefined && prevValue !== null && prevValue !== "" &&
                <p className="field-description">Last Reading: {prevValue}</p>
            }
            <input
                type={newType}
                className="form-control input-field"
                id={newId}
                name={name}
                onChange={onChangeInputCurrentReading}
                disabled={disabled}
                placeholder={hideLabel ? newLabel : ''}
            />
            
            {newDescription && <p className="field-description">{newDescription}</p>}
            {error && <div className="error-text">{error}</div>}
        </div>
    );
};

export default InputCurrentReading;
