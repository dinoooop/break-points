import React, { useEffect, useState } from "react";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../blend/formc/InputField";
import InputCropFile from "../../blend/formc/InputCropFile";
import Submit from "../../blend/one/Submit";
import { userFieldSet } from "../../bootstrap/stream/userFieldSet";
import { fomy } from "../../helpers/cssm/fomy";
import useUserStore from "../../helpers/stores/useUserStore";

const UserEditPage: React.FC = () => {
    const { update, loading, serverError, show, item } = useUserStore();

    const navigate = useNavigate();
    const fieldSet = fomy.refineFieldSet(userFieldSet, "edit");
    const rules = fomy.getFormRules(fieldSet, "edit");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState<Record<string, unknown>>(() => fomy.getFormValuesOrDummy(fieldSet, "edit"));

    const params = useParams();

    useEffect(() => {
        const raw = params.id;
        if (!raw) return;
        const id = parseInt(raw);
        if (!Number.isFinite(id)) return;
        show(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    useEffect(() => {
        if (item) {
            setFormValues((prev) => ({ ...prev, ...item }));
        }
    }, [item]);

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
            formValues.action = "admin_edit_user";
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
        <DashboardLayout dashParams={{ title: "Edit User", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>
                <InputField name="full_name" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputField name="email" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputCropFile name="avatar" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} updateExtraFields={updateExtraFields} imgCropKey="default" />
                <Submit loading={loading} serverError={serverError} formError={formError} />
            </form>
        </DashboardLayout>
    );
};

export default UserEditPage;
