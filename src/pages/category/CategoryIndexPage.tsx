import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import { fomy } from "../../helpers/cssm/fomy";
import InputField from "../../blend/formc/InputField";
import config from "../../config";
import { authFieldSet } from "../../bootstrap/stream/authFieldSet";
import Submit from "../../blend/one/Submit";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { useRef } from "react";
import DisplayCalendar from "../../blend/formc/InputSingleDateCalendar";
import useCategoryStore from "../../helpers/stores/useCategoryStore";
import { categoryFieldSet } from "../../bootstrap/stream/categoryFieldSet";
import { outer } from "../../helpers/cssm/outer";
import { useNavigate } from "react-router-dom";

const CategoryIndexPage: React.FC = () => {

    const { items, index, remove, destroy, serverError } = useCategoryStore();
    const navigate = useNavigate();

    const fieldSet = fomy.refineFieldSet(categoryFieldSet, 'index');
    const rules = fomy.getFormRules(fieldSet, 'index');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touchedId, setTouchedId] = useState<number | null>(null);
    const [formValues, setFormValues] = useState(fomy.getFormValuesOrDummy(fieldSet, 'index'));

    useEffect(() => {
        const data = Object.fromEntries(
            Object.entries(formValues)
                .filter(([_, value]) => value !== "")
                .map(([key, value]) => [key, value])
        );
        index(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);



    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showBottomNav, setShowBottomNav] = useState(false);


    const dashParams = {
        title: "BREAK POINTS",
        hasBack: false,
        hasMenu: true,
    }

    const handleDelete = () => {
        console.log(touchedId);

        if (touchedId !== null) {
            remove(touchedId);
            destroy(touchedId);
        }
    };
    const handleEdit = () => {

        if (touchedId !== null) {
            navigate(`/admin/categories/${touchedId}/edit`);
        }
    };

    const onChangeForm = (name: string, value: any) => {
        const instantNewFormValues = { ...formValues, [name]: value };
        const newErrors = fomy.validateOne(name, instantNewFormValues, rules);
        setFormValues(instantNewFormValues);
        setErrors(prev => ({ ...prev, ...newErrors }));
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
        navigate(`/admin/subjects?category=${id}`);
    }
    const handleDoubleClick = (id: number) => {
        setTouchedId(id);
        setShowBottomNav(true);

    }



    return (
        <DashboardLayout dashParams={dashParams}>
            <div className="body-content">
                {serverError && <p className='red-alert'>{serverError}</p>}

                {
                    items.map((item) => (
                        <div className="card-mini bg-dark-hover"

                            key={item.id}
                        >
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
                                <div className="title">{item.title}</div>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))
                }


            </div>

            <Link to="/admin/categories/create">
                <div className="floating-add-btn">+</div>
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