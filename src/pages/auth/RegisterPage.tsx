import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import { fomy } from "../../helpers/cssm/fomy";
import InputField from "../../blend/formc/InputField";
import config from "../../config";
import { authFieldSet } from "../../bootstrap/stream/authFieldSet";
import Submit from "../../blend/one/Submit";


const RegisterPage: React.FC = () => {
  const { register, loading, serverError } = useAuthStore();
  const fieldSet = fomy.refineFieldSet(authFieldSet, 'register')
  const rules = fomy.getFormRules(fieldSet, 'register')
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, 'register'));


  const onChangeForm = (name: string, value: any) => {
    const instantNewFormValues = { ...formValues, [name]: value }
    const newErrors = fomy.validateOne(name, instantNewFormValues, rules)
    setFormValues(instantNewFormValues)
    setErrors(prev => ({ ...prev, ...newErrors }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validated = fomy.validateMany(formValues, rules)
    if (!validated.allErrorsFalse) {
      setErrors(validated.updatedErrors)
    } else {
      const submitData = fomy.prepareSubmit(formValues)
      try {
        await register(submitData)
        navigate("/account/cars/create");

      } catch (error) {
        console.error(error)
      }
    }
  };

  return (
    <div className="auth-page bg-dark">

      <div className="auth-logo">
        {config.appName}
      </div>

      <div className="auth-welcome">
        Get start here
      </div>

      <div className="form-container">
        <form className="front-form" onSubmit={handleSubmit} noValidate={true}>
          <InputField name="full_name" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} hideLabel={true} />
          <InputField name="email" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} hideLabel={true} />
          <InputField name="password" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} hideLabel={true} />
          <InputField name="confirm_password" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} hideLabel={true} />

          {serverError && <p className="color-red">{serverError}</p>}

          <Submit label="Sign Up" cssClass="btn big" loading={loading} />
        </form>

        <div className="auth-footer text-center">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
          <p>
            Go back to <Link to="/">Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
