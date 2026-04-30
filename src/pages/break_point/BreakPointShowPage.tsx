import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlankDashboardLayout from "../../blend/layouts/BlankDashboardLayout";
import useBreakPointStore from "../../helpers/stores/useBreakPointStore";
import useSubjectStore from "../../helpers/stores/useSubjectStore";

const BreakPointShowPage: React.FC = () => {
    const { show, item } = useBreakPointStore();
    const { items: subjects, index: subjectIndex } = useSubjectStore();

    const navigate = useNavigate();
    const params = useParams();

    const [ready, setReady] = useState(false);

    useEffect(() => {
        subjectIndex({ page_size: 200 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (params.id) {
            const id = parseInt(params.id);
            show(id).finally(() => setReady(true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const subjectTitle = useMemo(() => {
        if (!item) return "";
        const subject = subjects.find((s) => s.id === item.subject);
        return subject?.title ?? `Subject #${item.subject}`;
    }, [subjects, item]);

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
                    <p>Break point not found</p>
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
                    <h1 className="mt-3">Break Point #{item.id}</h1>
                    <div className="mb-1">
                        <h2>Subject: {subjectTitle}</h2>
                    </div>
                    <div className="mb-1">
                        <h2>Status: {item.status}</h2>
                    </div>
                    <div className="mb-1">
                        <h2>Reading Date: {item.reading_date ?? "-"}</h2>
                    </div>
                    <div className="mb-1">
                        <h2>End Date: {item.end_date ?? "-"}</h2>
                    </div>
                    <div className="mb-1">
                        <h2>End Reading: {item.end_reading ?? "-"}</h2>
                    </div>

                    <div className="mb-1">
                        <h2>TH: {item.th ?? "-"}</h2>
                    </div>
                    <div className="mb-1">
                        <h2>CV: {item.cv ?? "-"}</h2>
                    </div>
                    <div className="mb-1">
                        <h2>RM: {item.rm ?? "-"}</h2>
                    </div>
                    <div className="mb-1">
                        <h2>EX: {item.ex ?? "-"}</h2>
                    </div>

                    <div className="d-flex-start-05">
                        <Link to={`/admin/break_points/${item.id}/edit`}>
                            <i className="icon fa-solid fa-pen-to-square"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </BlankDashboardLayout>
    );
};

export default BreakPointShowPage;

