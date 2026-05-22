import React, { useState } from "react";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import InputField from "../../blend/formc/InputField";
import Submit from "../../blend/one/Submit";
import { userFieldSet } from "../../bootstrap/stream/userFieldSet";
import { fomy } from "../../helpers/cssm/fomy";
import useUserStore from "../../helpers/stores/useUserStore";
import { useAuthStore } from "../../helpers/stores/useAuthStore";

const UserEditPage: React.FC = () => {
    const { update, loading, serverError } = useUserStore();
    const { user } = useAuthStore();


    const navigate = useNavigate();
    const fieldSet = fomy.refineFieldSet(userFieldSet, "security");
    const rules = fomy.getFormRules(fieldSet, "security");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState<Record<string, unknown>>(() => fomy.getFormValuesOrDummy(fieldSet, "security"));

    const onChangeForm = (name: string, value: unknown) => {
        const instantNewFormValues = { ...formValues, [name]: value };
        const newErrors = fomy.validateOne(name, instantNewFormValues, rules);
        setFormValues(instantNewFormValues);
        setErrors((prev) => ({ ...prev, ...(newErrors ?? {}) }));
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
            formValues.action = "user_edit_security";
            formValues.id = user?.id;
            const submitData = fomy.prepareSubmit(formValues);
            await update(submitData);
            if (!serverError && !loading) {
                navigate(-1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout dashParams={{ title: "Update Security", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>
                <InputField name="old_password" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputField name="new_password" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputField name="confirm_password" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <Submit loading={loading} serverError={serverError} formError={formError} />
            </form>
        </DashboardLayout>
    );
};

export default UserEditPage;
