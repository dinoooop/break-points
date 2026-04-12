import React, { useEffect, useState } from "react";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
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
import { outer } from "../../helpers/cssm/outer";
import BlankLayout from "../../blend/layouts/BlankLayout";


const CategoryShowPage: React.FC = () => {
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



    return (
        <div className="show-details bg-dark">
            <div className="floating-back-btn" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
            <img
                src={`${outer.showImage(formValues.cover, 'thumb')}`}
                alt={formValues.title}
                loading="lazy"
            />


            <div className="details">
                <h2>{formValues.title}</h2>
                <p>{formValues.description}</p>


                <div className="icon-box-set">
                    <i className="icon-box fa-solid fa-pen-to-square" onClick={() => navigate(`/admin/categories/${formValues.id}/edit`)}></i>
                    <i className="icon-box bg-danger fa-solid fa-trash"></i>
                </div>

            </div>
        </div>
    );
};

export default CategoryShowPage;
