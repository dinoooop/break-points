import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import { fomy } from "../../helpers/cssm/fomy";
import InputField from "../../blend/formc/InputField";
import config from "../../config";
import { authFieldSet } from "../../bootstrap/stream/authFieldSet";
import Submit from "../../blend/one/Submit";


const LoginPage: React.FC = () => {
  const { login, loading, serverError } = useAuthStore();
  const fieldSet = fomy.refineFieldSet(authFieldSet, 'login')
  const rules = fomy.getFormRules(fieldSet, 'login')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, 'login'));

  console.log(formValues);
  

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
        await login(submitData)
      } catch (error) {
        console.error(error)
      }
    }
  };

  return (
    <div className="container-admin">
            <div className="container ">
    <div className="auth-page bg-dark">

      <div className="logo">
        {config.appName}
      </div>

      <div className="welcome">
        Welcome Back
      </div>

      <div className="form-container">
        <form className="front-form" onSubmit={handleSubmit}>
          <InputField name="email" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} hideLabel={true} />
          <InputField name="password" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} hideLabel={true} />

          {serverError && <p className="color-red">{serverError}</p>}

          <Submit label="Sign In" cssClass="btn big" loading={loading} />
        </form>

        <div className="auth-footer text-center">
          <p>
            New here? <Link to="/register">Sign Up</Link> | Go back to <Link to="/admin/categories">Home</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default LoginPage;