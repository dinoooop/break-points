import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import useCategoryStore from "../../helpers/stores/useCategoryStore";
import { outer } from "../../helpers/cssm/outer";
import { useNavigate } from "react-router-dom";

const CategoryIndexPage: React.FC = () => {

    const { items, index, remove, destroy, serverError } = useCategoryStore();
    const navigate = useNavigate();
    const [touchedId, setTouchedId] = useState<number | null>(null);

    useEffect(() => {
        index();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showBottomNav, setShowBottomNav] = useState(false);


    const dashParams = {
        title: "Categories",
        hasBack: false,
        hasMenu: true,
    }

    const handleDelete = () => {
        if (touchedId !== null) {
            remove(touchedId);
            destroy(touchedId);
        }
        setShowBottomNav(false);

    };
    const handleEdit = () => {

        if (touchedId !== null) {
            navigate(`/admin/categories/${touchedId}/edit`);
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

    const handleOnClick = (id: number) => {
        // navigate to subjects like normal anchor click
        navigate(`/admin/subjects?category_id=${id}`);
    }

    return (
        <DashboardLayout dashParams={dashParams}>
            <div className="body-content">
                {serverError && <p className='red-alert'>{serverError}</p>}

                {
                    items.map((item) => (
                        <div className="card bg-dark-hover" key={item.id}>
                            <div className="card-image">
                                <Link to={`/admin/categories/${item.id}/show`}>
                                    <img
                                        src={`${outer.showImage(item.cover, 'thumb')}`}
                                        alt={item.title}
                                        loading="lazy"
                                    />
                                </Link>
                            </div>
                            <div className="card-content"
                                onTouchStart={() => handleTouchStart(item.id)}
                                onTouchEnd={handleTouchEnd}
                                onClick={() => handleOnClick(item.id)}
                            >
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))
                }


            </div>

            <Link to="/admin/categories/create">
                <div className="floating-btn-bottom-right">+</div>
            </Link>

            <div className={`bottom-nav ${showBottomNav ? "active" : ""}`}>
                <div className="close-area" onClick={() => setShowBottomNav(false)}></div>
                <div className="nav-content">
                    <div className="bottom-nav-item" onClick={handleEdit}>Edit</div>
                    <div className="bottom-nav-item" onClick={handleDelete}>Delete</div>
                    <div className="bottom-nav-item">Details</div>
                    <div className="bottom-nav-item">Update CR</div>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default CategoryIndexPage;
