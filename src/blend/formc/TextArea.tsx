import React from "react";

interface TextAreaFieldProps {
  name: string;
  fieldSet: Record<string, any>;
  formValues: Record<string, any>;
  errors: Record<string, string>;
  onChangeForm: (name: string, value: any) => void;
  id?: string;
  label?: string;
}

const TextArea: React.FC<TextAreaFieldProps> = ({
  name,
  fieldSet,
  formValues,
  errors,
  onChangeForm,
}) => {

  if (!fieldSet[name]) {
    throw new Error(`${name} not found`);
  }

  const newId = fieldSet[name].id;
  const newLabel = fieldSet[name].label;
  const value = formValues[name] ?? "";
  const error = errors[name] ?? "";

  const onChangeInputField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeForm(name, e.target.value);
  };

  return (
    <div className="form-group">
      <label htmlFor={newId}>{newLabel}</label>
      <textarea
        className="form-control textarea"
        id={newId}
        value={value}
        name={name}
        onChange={onChangeInputField}
      />
      {error && <div className="color-red">{error}</div>}
    </div>
  );
};

export default TextArea;
