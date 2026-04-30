import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlankDashboardLayout from "../../blend/layouts/BlankDashboardLayout";
import useSubjectStore from "../../helpers/stores/useSubjectStore";
import useCategoryStore from "../../helpers/stores/useCategoryStore";

const SubjectShowPage: React.FC = () => {
    const { show, item } = useSubjectStore();
    const { items: categories, index: categoryIndex } = useCategoryStore();

    const navigate = useNavigate();
    const params = useParams();

    const [ready, setReady] = useState(false);

    useEffect(() => {
        categoryIndex({ page_size: 100 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (params.id) {
            const id = parseInt(params.id);
            show(id).finally(() => setReady(true));
        }
    }, [params]);

    const categoryTitle = useMemo(() => {
        if (!item) return "";
        const category = categories.find((c) => c.id === item.category);
        return category?.title ?? `Category #${item.category}`;
    }, [categories, item]);

    if (!ready) {
        return (
            <BlankDashboardLayout>
                <div className="container-body">
                    <p>Loading...</p>
                </div>
            </BlankDashboardLayout>
        );
    }

    if (!item) {
        return (
            <BlankDashboardLayout>
                <div className="floating-btn-top-left" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>
                <div className="container-body">
                    <p>Subject not found</p>
                </div>
            </BlankDashboardLayout>
        );
    }

    return (
        <BlankDashboardLayout>
            <div className="floating-btn-top-left" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
            <div className="show-details bg-dark">
                <div className="details">
                    <h1 className="mt-3">{item.title}</h1>
                    <div className="mb-1">
                        <h2>Category: {categoryTitle}</h2>
                    </div>
                    <div className="mb-1">
                        <h2>Threshold: {item.threshold}</h2>
                    </div>
                    <p>{item.description}</p>

                    <div className="d-flex-start-05">
                        <Link to={`/admin/subjects/${item.id}/edit`}>
                            <i className="icon fa-solid fa-pen-to-square"></i>
                        </Link>
                        <Link to={`/admin/break_points?subject_id=${item.id}`}>
                            <i className="icon fa-solid fa-chart-line"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </BlankDashboardLayout>
    );
};

export default SubjectShowPage;
