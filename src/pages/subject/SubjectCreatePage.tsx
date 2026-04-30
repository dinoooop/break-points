import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { fomy } from "../../helpers/cssm/fomy";
import { subjectFieldSet } from "../../bootstrap/stream/subjectFieldSet";
import InputField from "../../blend/formc/InputField";
import TextArea from "../../blend/formc/TextArea";
import Submit from "../../blend/one/Submit";
import useSubjectStore from "../../helpers/stores/useSubjectStore";
import Radio from "../../blend/formc/Radio";
import { st } from "../../bootstrap/st/st";

const SubjectCreatePage: React.FC = () => {
    const { store, loading, serverError } = useSubjectStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const fieldSet = fomy.refineFieldSet(subjectFieldSet, "create");
    const rules = fomy.getFormRules(fieldSet, "create");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, "create"));

    const categoryId = useMemo(() => {
        const raw = searchParams.get("category_id");
        if (!raw) return null;
        const parsed = parseInt(raw);
        return Number.isFinite(parsed) ? parsed : null;
    }, [searchParams])

    const onChangeForm = (name: string, value: any) => {
        const instantNewFormValues = { ...formValues, [name]: value };
        const newErrors = fomy.validateOne(name, instantNewFormValues, rules);
        setFormValues(instantNewFormValues);
        setErrors((prev) => ({ ...prev, ...(newErrors ?? {}) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        formValues.category = categoryId;

        const validated = fomy.validateMany(formValues, rules);
        if (!validated.allErrorsFalse) {
            setErrors(validated.updatedErrors);
            setFormError(validated.firstError);
            return;
        }

        try {
            await store(fomy.prepareSubmit(formValues));
            navigate(-1);
        } catch { }
    };

    return (
        <DashboardLayout dashParams={{ title: "Create Subject", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>
                <InputField name="title" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                {/* <InputField type="date" name="last_end_date" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} /> */}
                <Radio name="mode" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} options={st.modes()} />
                
                <InputField name="threshold" type="number" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <TextArea name="description" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <Submit loading={loading} serverError={serverError} formError={formError} />
            </form>
        </DashboardLayout>
    );
};

export default SubjectCreatePage;
