import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { fomy } from "../../helpers/cssm/fomy";
import InputField from "../../blend/formc/InputField";
import Submit from "../../blend/one/Submit";
import useBreakPointStore from "../../helpers/stores/useBreakPointStore";
import useSubjectStore from "../../helpers/stores/useSubjectStore";
import Select from "../../blend/formc/Select";
import type { OptionItem } from "../../blend/formc/Select";
import { breakPointFieldSet } from "../../bootstrap/stream/breakPointFieldSet";
import Radio from "../../blend/formc/Radio";
import TextArea from "../../blend/formc/TextArea";

const BreakPointEditPage: React.FC = () => {
    const { update, loading, serverError, show, item } = useBreakPointStore();

    const navigate = useNavigate();
    const params = useParams();

    const fieldSet = fomy.refineFieldSet(breakPointFieldSet, "edit");
    const rules = fomy.getFormRules(fieldSet, "edit");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, "edit"));

    useEffect(() => {
        if (params.id) {
            const id = parseInt(params.id);
            if (Number.isFinite(id)) {
                show(id);
            }
        }
    }, [params.id]);

    useEffect(() => {
        if (item) {
            setFormValues(prev => ({ ...prev, ...item }));
        }
    }, [item]);

    const onChangeForm = (name: string, value: any) => {
        const instantNewFormValues = { ...formValues, [name]: value };
        const newErrors = fomy.validateOne(name, instantNewFormValues, rules);
        setFormValues(instantNewFormValues);
        setErrors(prev => ({ ...prev, ...newErrors }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validated = fomy.validateMany(formValues, rules);
        formValues.subject = item?.subject?.id;
        
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
        <DashboardLayout dashParams={{ title: "Edit Break Point", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>

                {
                    item?.subject && typeof item.subject === 'object' && item.subject.mode == 'date_type' &&
                    <>
                        <InputField name="end_date" type="date" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                    </>
                }
                {
                    item?.subject && typeof item.subject === 'object' && item.subject.mode == 'reading_type' &&
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

export default BreakPointEditPage;

