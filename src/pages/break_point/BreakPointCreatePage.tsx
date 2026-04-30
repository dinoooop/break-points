import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { fomy } from "../../helpers/cssm/fomy";
import InputField from "../../blend/formc/InputField";
import Submit from "../../blend/one/Submit";
import useBreakPointStore from "../../helpers/stores/useBreakPointStore";
import useSubjectStore from "../../helpers/stores/useSubjectStore";
import { breakPointFieldSet } from "../../bootstrap/stream/breakPointFieldSet";
import TextArea from "../../blend/formc/TextArea";

const BreakPointCreatePage: React.FC = () => {
    const { store, loading, serverError } = useBreakPointStore();
    const { show: showSubject, item: subjectItem } = useSubjectStore();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const fieldSet = fomy.refineFieldSet(breakPointFieldSet, "create");
    const rules = fomy.getFormRules(fieldSet, "create");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, "create"));

    const subjectId = useMemo(() => {
        const raw = searchParams.get("subject_id");
        if (!raw) return null;
        const parsed = parseInt(raw);
        return Number.isFinite(parsed) ? parsed : null;
    }, [searchParams]);

    useEffect(() => {
        if (subjectId) {
            showSubject(subjectId)
        }
    }, [subjectId]);

    const onChangeForm = (name: string, value: any) => {
        const instantNewFormValues = { ...formValues, [name]: value };
        const newErrors = fomy.validateOne(name, instantNewFormValues, rules);
        setFormValues(instantNewFormValues);
        setErrors((prev) => ({ ...prev, ...(newErrors ?? {}) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (subjectId) {
            formValues.subject = subjectId;
        }

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
        <DashboardLayout dashParams={{ title: "Create Break Point", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>

                {
                    subjectItem && subjectItem.mode == 'date_type' &&
                    <>
                        <InputField name="end_date" type="date" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                    </>
                }
                {
                    subjectItem && subjectItem.mode == 'reading_type' &&
                    <>
                        <InputField name="reading_date" type="date" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                        <InputField name="end_reading" type="number" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                    </>
                }
                <TextArea name="description" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />


                <Submit loading={loading} serverError={serverError} formError={formError} />
            </form>
        </DashboardLayout>
    );
};

export default BreakPointCreatePage;

