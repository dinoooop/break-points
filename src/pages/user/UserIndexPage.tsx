import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import useUserStore from "../../helpers/stores/useUserStore";
import { outer } from "../../helpers/cssm/outer";

const UserIndexPage: React.FC = () => {
    const { items, index, remove, destroy, serverError } = useUserStore();
    const navigate = useNavigate();

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showBottomNav, setShowBottomNav] = useState(false);
    const [touchedId, setTouchedId] = useState<number | null>(null);

    useEffect(() => {
        index();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dashParams = {
        title: "Users",
        hasBack: false,
        hasMenu: true,
    };

    const handleDelete = () => {
        if (touchedId !== null) {
            remove(touchedId);
            destroy(touchedId);
        }
        setShowBottomNav(false);
    };

    const handleEdit = () => {
        if (touchedId !== null) {
            navigate(`/admin/users/${touchedId}/edit`);
        }
    };

    const handleDetails = () => {
        if (touchedId !== null) {
            navigate(`/admin/users/${touchedId}/show`);
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
                    <div className="card bg-dark-hover" key={item.id}>
                        <div className="card-image">
                            <Link to={`/admin/users/${item.id}/show`}>
                                <img
                                    src={`${outer.showImage(item.avatar, "thumb")}`}
                                    alt={item.full_name}
                                    loading="lazy"
                                />
                            </Link>
                        </div>
                        <div
                            className="card-content"
                            onTouchStart={() => handleTouchStart(item.id)}
                            onTouchEnd={handleTouchEnd}
                            onDoubleClick={() => {
                                setTouchedId(item.id);
                                setShowBottomNav(true);
                            }}
                            onClick={() => navigate(`/admin/users/${item.id}/show`)}
                        >
                            <h3>{item.full_name}</h3>
                            <p>{item.email}</p>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="empty-state">
                        <p className="info">No users found.</p>
                        <p>
                            <Link to="/admin/users/create">Create your first user.</Link>
                        </p>
                    </div>
                )}
            </div>

            <Link to="/admin/users/create">
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

export default UserIndexPage;

