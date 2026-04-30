import React, { useEffect, useState } from "react";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { fomy } from "../../helpers/cssm/fomy";
import { categoryFieldSet } from "../../bootstrap/stream/categoryFieldSet";
import InputField from "../../blend/formc/InputField";
import TextArea from "../../blend/formc/TextArea";
import useCategoryStore from "../../helpers/stores/useCategoryStore";
import Submit from "../../blend/one/Submit";
import InputCropFile from "../../blend/formc/InputCropFile";
import InputCurrentReading from "../../blend/formc/InputCurrentReading";

const CategoryEditPage: React.FC = () => {
    const { update, loading, serverError, show, item } = useCategoryStore();

    const navigate = useNavigate();
    const fieldSet = fomy.refineFieldSet(categoryFieldSet, "edit");
    const rules = fomy.getFormRules(fieldSet, "edit");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, "edit"));

    const params = useParams();

    useEffect(() => {
        if (params.id) {
            const id = parseInt(params.id);
            show(id);
        }
    }, [params]);

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

    const updateExtraFields = (newFormValue: Record<string, any>) => {
        setFormValues(prev => ({ ...prev, ...newFormValue }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validated = fomy.validateMany(formValues, rules);
        if (!validated.allErrorsFalse) {
            setErrors(validated.updatedErrors);
            setFormError(validated.firstError);
        } else {
            const submitData = fomy.prepareSubmit(formValues);
            try {
                await update(submitData);
                if (!serverError && !loading) {
                    navigate(-1);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <DashboardLayout dashParams={{ title: "Create Category", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>
                <InputField name="title" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputCurrentReading name="category_current_reading" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <TextArea name="description" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <InputCropFile name="cover" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} updateExtraFields={updateExtraFields} />
                <Submit loading={loading} serverError={serverError} formError={formError} />
            </form>
        </DashboardLayout>
    );
};

export default CategoryEditPage;
