import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import useSubjectStore from "../../helpers/stores/useSubjectStore";
import useCategoryStore from "../../helpers/stores/useCategoryStore";
import ActiveBreakPoint from "../../blend/one/ActiveBreakPoint";

const SubjectIndexPage: React.FC = () => {
    const { items, index, remove, destroy, serverError } = useSubjectStore();
    const { item: categoryItem, show: categoryShow } = useCategoryStore();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showBottomNav, setShowBottomNav] = useState(false);
    const [touchedId, setTouchedId] = useState<number | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [dashParams, setDashParams] = useState({
        title: "Subjects",
        hasBack: true,
        hasMenu: true,
    });



    useEffect(() => {

        const raw = searchParams.get("category_id");

        if (raw) {
            const parsed = parseInt(raw);
            const categoryId = isNaN(parsed) ? null : parsed;
            setCategoryId(categoryId);
        }

    }, [searchParams.get("category_id")]);

    useEffect(() => {
        const params: Record<string, any> = {};
        if (categoryId) {
            params.category_id = categoryId;
            categoryShow(categoryId);
            index(params);
        }
    }, [categoryId]);


    useEffect(() => {
        setDashParams((prev) => ({
            ...prev,
            title: categoryItem?.title ?? "Category",
        }));
    }, [categoryItem]);


    const handleDelete = () => {
        if (touchedId !== null) {
            remove(touchedId);
            destroy(touchedId);
        }
        setShowBottomNav(false);

    };

    const handleEdit = () => {
        if (touchedId !== null) {
            navigate(`/admin/subjects/${touchedId}/edit`);
        }
    };

    const handleDetails = () => {
        if (touchedId !== null) {
            navigate(`/admin/subjects/${touchedId}/show`);
        }
    };

    const handleTouchStart = (id: number) => {
        timerRef.current = setTimeout(() => {
            setTouchedId(id);
            setShowBottomNav(true);
        }, 700);
    };

    const handleTouchEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    return (
        <DashboardLayout dashParams={dashParams}>
            <div className="body-content">
                {serverError && <p className="red-alert">{serverError}</p>}


                {items.map((item) => (
                    <div
                        className="card-count bg-dark-hover"
                        key={item.id}
                        onTouchStart={() => handleTouchStart(item.id)}
                        onTouchEnd={handleTouchEnd}
                        onDoubleClick={() => {
                            setTouchedId(item.id);
                            setShowBottomNav(true);
                        }}
                        onClick={() => navigate(`/admin/break_points?subject_id=${item.id}`)}
                    >
                        <ActiveBreakPoint subject={item} category={categoryItem} />
                    </div>
                ))}

                {
                    items.length === 0 && (
                        <div className="empty-state">
                            <p className="info">No subjects found.</p>
                            <p><Link to={`/admin/subjects/create?category_id=${categoryId}`}>Create your first subject.</Link></p>
                        </div>
                    )
                }
            </div>

            <Link to={`/admin/subjects/create?category_id=${categoryId}`}>
                <div className="floating-btn-bottom-right">+</div>
            </Link>

            <div className={`bottom-nav ${showBottomNav ? "active" : ""}`}>
                <div className="close-area" onClick={() => setShowBottomNav(false)}></div>
                <div className="nav-content">
                    <div className="bottom-nav-item" onClick={handleEdit}>
                        Edit
                    </div>
                    <div className="bottom-nav-item" onClick={handleDelete}>
                        Delete
                    </div>
                    <div className="bottom-nav-item" onClick={handleDetails}>
                        Details
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SubjectIndexPage;
