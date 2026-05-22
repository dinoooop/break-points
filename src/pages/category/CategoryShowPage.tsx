import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCategoryStore from "../../helpers/stores/useCategoryStore";
import { outer } from "../../helpers/cssm/outer";
import BlankDashboardLayout from "../../blend/layouts/BlankDashboardLayout";


const CategoryShowPage: React.FC = () => {
    const { show, item } = useCategoryStore();

    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<Record<string, any>>({});

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
            setFormValues(prev => ({ ...prev, ...item }));
        }
    }, [item]);




    return (
        <BlankDashboardLayout>
            <div className="floating-btn-top-left" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
            <div className="show-details bg-dark">
                <div className="holder">
                    <img
                        src={`${outer.showImage(formValues.cover, 'cover', 'general')}`}
                        alt={formValues.title}
                        loading="lazy"
                    />
                </div>


                <div className="details">
                    <h1>{formValues.title}</h1>

                    <div className="mb-1">
                        <h2>Current Reading: {formValues.current_reading}</h2>
                    </div>

                    <p>{formValues.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus expedita reiciendis est minima beatae rerum nobis mollitia totam quibusdam molestias eaque cumque dignissimos animi adipisci blanditiis, exercitationem delectus architecto debitis.</p>


                    <div className="d-flex-start-05">

                        <Link to={`/admin/categories/${formValues.id}/edit`}>
                            <i className="icon fa-solid fa-pen-to-square"></i>
                        </Link>
                        <Link to={`/admin/categories/${formValues.id}/edit`}>
                            <i className="icon fa-solid fa-bars"></i>
                        </Link>
                        <i className="icon bg-danger fa-solid fa-trash"></i>
                    </div>

                </div>
            </div>
        </BlankDashboardLayout>
    );
};

export default CategoryShowPage;
