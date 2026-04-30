import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import useBreakPointStore from "../../helpers/stores/useBreakPointStore";
import useSubjectStore from "../../helpers/stores/useSubjectStore";
import ActiveBreakPoint from "../../blend/one/ActiveBreakPoint";
import useCategoryStore from "../../helpers/stores/useCategoryStore";

const BreakPointIndexPage: React.FC = () => {
    const { items, index, remove, destroy, serverError } = useBreakPointStore();
    const { item: subjectItem, show: subjectShow } = useSubjectStore();
    const { item: categoryItem, show: categoryShow } = useCategoryStore();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showBottomNav, setShowBottomNav] = useState(false);
    const [touchedId, setTouchedId] = useState<number | null>(null);
    const [subjectId, setSubjectId] = useState<number | null>(null);

    const [dashParams, setDashParams] = useState({
        title: "Break Points",
        hasBack: true,
        hasMenu: true,
    });

    useEffect(() => {
        const raw = searchParams.get("subject_id");
        if (raw) {
            const parsed = parseInt(raw);
            setSubjectId(Number.isFinite(parsed) ? parsed : null);
            return;
        }
        setSubjectId(null);
    }, [searchParams]);

    useEffect(() => {
        const params: Record<string, any> = {};
        if (subjectId) {
            params.subject_id = subjectId;
            subjectShow(subjectId);
            index(params);
        }
    }, [subjectId]);

    useEffect(() => {
        setDashParams((prev) => ({
            ...prev,
            title: subjectItem?.title ? subjectItem.title : `Break Points`,
        }));

        if (subjectItem && subjectItem.category) {
            categoryShow(subjectItem.category);
        }
    }, [subjectId, subjectItem]);

    const handleDelete = () => {
        if (touchedId !== null) {
            remove(touchedId);
            destroy(touchedId);
        }
        setShowBottomNav(false);
    };

    const handleEdit = () => {
        if (touchedId !== null) {
            navigate(`/admin/break_points/${touchedId}/edit`);
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
                {items.length > 0 && (
                    <div
                        className="card-count bg-dark-hover"
                        key={0}
                    >
                        <ActiveBreakPoint subject={subjectItem ?? {}} category={categoryItem ?? {}} showTodayTitle={true} />
                    </div>
                )}

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
                    >
                        {
                            subjectItem && subjectItem.mode == 'date_type' ?
                                <>
                                    <h2>{item.end_date}</h2>
                                    <p className="mt-1">{item.description}</p>
                                </>
                                :
                                <>
                                    <h2>{item.reading_date}</h2>
                                    <p className="mt-1">{item.end_reading}</p>
                                    <p className="mt-1">{item.description}</p>
                                </>
                        }

                        <div className="count-info">
                            <p>TH: {item.th ?? "-"}</p>
                            <p>CV: {item.cv ?? "-"}</p>
                            <p>RM: {item.rm ?? "-"}</p>
                            <p>EX: {item.ex ?? "-"}</p>
                        </div>
                    </div>
                ))}

                {
                    items.length === 0 && (
                        <div className="empty-state">
                            <p className="info">No break points found.</p>
                            <p><Link to={`/admin/break_points/create${subjectId ? `?subject_id=${subjectId}first=1` : ""}`}>Create your first break point.</Link></p>
                        </div>
                    )
                }
            </div>

            <Link to={`/admin/break_points/create${subjectId ? `?subject_id=${subjectId}` : ""}`}>
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

                </div>
            </div>
        </DashboardLayout>
    );
};

export default BreakPointIndexPage;
