import React, { useState } from "react";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { fomy } from "../../helpers/cssm/fomy";
import { categoryFieldSet } from "../../bootstrap/stream/categoryFieldSet";
import InputField from "../../blend/formc/InputField";
import TextArea from "../../blend/formc/TextArea";
import Checkbox from "../../blend/formc/Checkbox";
import { st } from "../../bootstrap/st/st";
import useCategoryStore from "../../helpers/stores/useCategoryStore";
import Radio from "../../blend/formc/Radio";
import Submit from "../../blend/one/Submit";
import InputCropFile from "../../blend/formc/InputCropFile";


const CategoryCreatePage: React.FC = () => {
    const { store, loading, serverError } = useCategoryStore();

    const navigate = useNavigate();
    const fieldSet = fomy.refineFieldSet(categoryFieldSet, "create");
    const rules = fomy.getFormRules(fieldSet, "create");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string>("");
    const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, "create"));

    const onChangeForm = (name: string, value: any) => {
        const instantNewFormValues = { ...formValues, [name]: value };
        const newErrors = fomy.validateOne(name, instantNewFormValues, rules);
        setFormValues(instantNewFormValues);
        setErrors((prev) => ({ ...prev, ...newErrors }));
    };

    const updateExtraFields = (newFormValue: Record<string, any>) => {
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
            await store(fomy.prepareSubmit(formValues));
            navigate("/admin/categories");
        } catch { }
    };

    return (
        <DashboardLayout dashParams={{ title: "Create Category", hasBack: true, hasMenu: false }}>
            <form className="form-body" onSubmit={handleSubmit}>
                <InputField name="title" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <TextArea name="description" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
                <Radio name="mode" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} options={st.modes()} />
                <InputCropFile name="cover" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} updateExtraFields={updateExtraFields} />

                {serverError && <p className="error-text">{serverError}</p>}
                {formError && <p className="error-text">{formError}</p>}
                <Submit loading={loading} />
            </form>
        </DashboardLayout>
    );
};

export default CategoryCreatePage;
