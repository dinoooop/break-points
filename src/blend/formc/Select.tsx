import React from "react";

export interface OptionItem {
  label: string;
  value: number | string;
}

interface SelectFieldProps {
  name: string;
  fieldSet: Record<string, any>;
  formValues: Record<string, any>;
  onChangeForm: (name: string, value: any) => void;
  errors: Record<string, string>;
  options?: OptionItem[];
  showEmpty?: boolean;
  className?: string;
}


const Select: React.FC<SelectFieldProps> = ({
  name,
  fieldSet,
  formValues,
  onChangeForm,
  errors,
  options = [],
  showEmpty = true,
  className = "form-control",
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeForm(name, e.target.value);
  };

  return (
    <div className="form-group">
      {newLabel && <label htmlFor={newId}>{newLabel}</label>}

      <select
        id={newId}
        name={name}
        value={value}
        onChange={handleChange}
        className={className}
      >
        {showEmpty && (
          <option value="">
            -- Select --
          </option>
        )}
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default Select;
