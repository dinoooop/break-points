import React, { useState } from "react";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import PinCarCreate from "../../blend/templates/PinCarCreate";
import { useNavigate } from "react-router-dom";
import { fomy } from "../../helpers/cssm/fomy";
import { categoryFieldSet } from "../../bootstrap/stream/categoryFieldSet";


const CategoryCreatePage: React.FC = () => {
    const { store, loading, serverError } = useCategoryStore();

    console.log(sv.brands());
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
        <DashboardLayout>
            <InputField name="title" fieldSet={fieldSet} formValues={formValues} errors={errors} onChangeForm={onChangeForm} />
        </DashboardLayout>
    );
};

export default CategoryCreatePage;
