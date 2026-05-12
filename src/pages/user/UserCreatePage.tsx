import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import InputField from "../../blend/formc/InputField";
import InputCropFile from "../../blend/formc/InputCropFile";
import Submit from "../../blend/one/Submit";
import { userFieldSet } from "../../bootstrap/stream/userFieldSet";
import { fomy } from "../../helpers/cssm/fomy";
import useUserStore from "../../helpers/stores/useUserStore";

const UserCreatePage: React.FC = () => {
    const { store, loading, serverError } = useUserStore();

    const navigate = useNavigate();
    const fieldSet = fomy.refineFieldSet(userFieldSet, "create");
    const rules = fomy.getFormRules(fieldSet, "create");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState<Record<string, unknown>>(() => fomy.getFormValuesOrDummy(fieldSet, "create"));

    const onChangeForm = (name: string, value: unknown) => {
        const instantNewFormValues = { ...formValues, [name]: value };
        const newErrors = fomy.validateOne(name, instantNewFormValues, rules);
        setFormValues(instantNewFormValues);
        setErrors((prev) => ({ ...prev, ...(newErrors ?? {}) }));
    };

    const updateExtraFields = (newFormValue: Record<string, unknown>) => {
        setFormValues((prev) => ({ ...prev, ...newFormValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validated = fomy.validateMany(formValues, rules);
        if (!validated.allErrorsFalse) {
            setErrors(validated.updatedErrors);
            setFormError(validated.firstError);
            return;
        }

        try {
            formValues.action = "admin_create_user";
            const submitData = fomy.prepareSubmit(formValues);
            await store(submitData);
            if (!serverError && !loading) {
                navigate(-1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout dashParams={{ title: "Create User", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>
                <InputField name="full_name" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputField name="email" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputField name="password" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputCropFile name="avatar" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} updateExtraFields={updateExtraFields} imgCropKey="default" />
                <Submit loading={loading} serverError={serverError} formError={formError} />
            </form>
        </DashboardLayout>
    );
};

export default UserCreatePage;
