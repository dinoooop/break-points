import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlankDashboardLayout from "../../blend/layouts/BlankDashboardLayout";
import useUserStore from "../../helpers/stores/useUserStore";
import { outer } from "../../helpers/cssm/outer";
import type { User } from "../../bootstrap/stream/UserItem";

const UserShowPage: React.FC = () => {
    const { show, item } = useUserStore();

    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<Partial<User>>({});

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
            setFormValues((prev) => ({ ...prev, ...item }));
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
                        src={`${outer.showImage(formValues.avatar, "thumb")}`}
                        alt={formValues.full_name ?? "User"}
                        loading="lazy"
                    />
                </div>

                <div className="details">
                    <h1>{formValues.full_name}</h1>
                    <p>{formValues.email}</p>

                    <div className="d-flex-start-05">
                        <Link to={`/admin/users/${formValues.id}/edit`}>
                            <i className="icon fa-solid fa-pen-to-square"></i>
                        </Link>
                        <Link to={`/admin/users/${formValues.id}/edit`}>
                            <i className="icon fa-solid fa-bars"></i>
                        </Link>
                        <i className="icon bg-danger fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>
        </BlankDashboardLayout>
    );
};

export default UserShowPage;
