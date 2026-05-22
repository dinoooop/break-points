import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlankDashboardLayout from "../../blend/layouts/BlankDashboardLayout";
import useUserStore from "../../helpers/stores/useUserStore";
import { outer } from "../../helpers/cssm/outer";
import type { User } from "../../bootstrap/stream/UserItem";
import { useAuthStore } from "../../helpers/stores/useAuthStore";

const UserShowPage: React.FC = () => {
    const { show, item, destroy } = useUserStore();
    const { user } = useAuthStore();

    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<Partial<User>>({});
    const [isProfile, setIsProfile] = useState(false);

    const params = useParams();

    useEffect(() => {
        const raw = params.id;
        if (!raw) {
            // check url contains "profile"
            if (window.location.pathname.includes("profile")) {
                show(user?.id || 0);
                setIsProfile(true);
            }
        } else {
            const id = parseInt(raw);
            if (!Number.isFinite(id)) return;
            show(id);
        }

    }, [params.id]);

    useEffect(() => {
        if (item) {
            setFormValues((prev) => ({ ...prev, ...item }));
        }
    }, [item]);

    const handleDelete = () => {
        // Implement delete functionality here
        if (item) {
            destroy(item.id);
            navigate("/admin/users");
        }
    }

    return (
        <BlankDashboardLayout>
            <div className="floating-btn-top-left" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>

            <div className="show-details bg-dark">
                <div className="holder">
                    <img
                        src={`${outer.showImage(formValues.avatar, "cover")}`}
                        alt={formValues.first_name ?? "User"}
                        loading="lazy"
                    />
                </div>

                <div className="details">
                    <h1>{formValues.first_name}</h1>
                    <p>{formValues.email}</p>
                    <p>{formValues.phone}</p>
                    <p>{formValues.about}</p>

                    <div className="d-flex-start-05">

                        {
                            isProfile ? (
                                <Link to={`/admin/profile/edit`}>
                                    <i className="icon fa-solid fa-pen-to-square"></i>
                                </Link>
                            ) :
                                (
                                    <Link to={`/admin/users/${formValues.id}/edit`}>
                                        <i className="icon fa-solid fa-bars"></i>
                                    </Link>
                                )

                        }
                        <Link to={`/admin/profile/security`}>
                            <i className="icon fa-solid fa-lock"></i>
                        </Link>
                        {
                            !isProfile && (
                                <i className="icon bg-danger fa-solid fa-trash" onClick={handleDelete}></i>
                            )
                        }

                    </div>
                </div>
            </div>
        </BlankDashboardLayout>
    );
};

export default UserShowPage;
