import React from "react";

interface InputFieldProps {
  name: string;
  fieldSet: Record<string, any>;
  formValues: Record<string, any>;
  onChangeForm: (name: string, value: any) => void;
  errors: Record<string, string>;
  type?: string;
  disabled?: boolean;
  hideLabel?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  fieldSet,
  formValues,
  errors,
  onChangeForm,
  type,
  disabled = false,
  hideLabel= false,
}) => {

  if (!fieldSet[name]) {
    throw new Error(`${name} not found`);
  }

  const newId = fieldSet[name].id;
  const newLabel = fieldSet[name].label;
  const newDescription = fieldSet[name].description?? '';

  let value = formValues[name] ?? "";
  const error = errors[name] ?? "";

  if (value == "") {
    value = fieldSet[name].default_value ?? "";
  }

  let newType: string;
  if (type) {
    newType = type;
  } else if (name.toLowerCase().includes("password")) {
    newType = "password";
  } else {
    newType = name === "email" ? "email" : "text";
  }

  const onChangeInputField = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeForm(name, e.target.value);
  };

  return (
    <div className="form-group">
      {
        !hideLabel &&
        <label htmlFor={newId}>{newLabel}</label>
      }
      <input
        type={newType}
        className="form-control input-field"
        id={newId}
        value={value}
        name={name}
        onChange={onChangeInputField}
        disabled={disabled}
        placeholder={hideLabel ? newLabel : ''}
      />
      {newDescription && <p className="field-description">{newDescription}</p>}
      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

export default InputField;
