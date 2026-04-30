import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { fomy } from "../../helpers/cssm/fomy";
import { subjectFieldSet } from "../../bootstrap/stream/subjectFieldSet";
import InputField from "../../blend/formc/InputField";
import TextArea from "../../blend/formc/TextArea";
import Submit from "../../blend/one/Submit";
import useSubjectStore from "../../helpers/stores/useSubjectStore";
import { st } from "../../bootstrap/st/st";
import Radio from "../../blend/formc/Radio";

const SubjectEditPage: React.FC = () => {
    const { update, loading, serverError, show, item } = useSubjectStore();

    const navigate = useNavigate();
    const params = useParams();

    const fieldSet = fomy.refineFieldSet(subjectFieldSet, "edit");
    const rules = fomy.getFormRules(fieldSet, "edit");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, "edit"));

    useEffect(() => {
        if (params.id) {
            const id = parseInt(params.id);
            show(id);
        }
    }, [params]);

    useEffect(() => {
        if (item) {
            setFormValues((prev: any) => ({ ...prev, ...item }));
        }
    }, [item]);

    const onChangeForm = (name: string, value: any) => {
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

        const submitData = fomy.prepareSubmit(formValues);
        try {
            await update(submitData);
            if (!serverError && !loading) {
                navigate(-1);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DashboardLayout dashParams={{ title: "Edit Subject", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>
                <InputField name="title" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <TextArea name="description" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <Radio name="mode" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} options={st.modes()} />
                <InputField name="threshold" type="number" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />

                <Submit loading={loading} serverError={serverError} formError={formError} />
            </form>
        </DashboardLayout>
    );
};

export default SubjectEditPage;
