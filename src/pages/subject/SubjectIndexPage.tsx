import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import { fomy } from "../../helpers/cssm/fomy";
import InputField from "../../blend/formc/InputField";
import config from "../../config";
import { authFieldSet } from "../../bootstrap/stream/authFieldSet";
import Submit from "../../blend/one/Submit";
import DashboardLayout from "../../blend/layouts/DashboardLayout";
import { useRef } from "react";

const SubjectIndexPage: React.FC = () => {
    const { login, loading, serverError } = useAuthStore();
    const fieldSet = fomy.refineFieldSet(authFieldSet, 'login')
    const rules = fomy.getFormRules(fieldSet, 'login')
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showBottomNav, setShowBottomNav] = useState(false);

    const dashParams = {
        title: "Subjects",
        hasBack: true,
        hasMenu: true,
    }

    const handleTouchStart = () => {
        timerRef.current = setTimeout(() => {
            setShowBottomNav(true); // 👈 open
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
                <div className="card-count bg-dark-hover"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onDoubleClick={() => setShowBottomNav(true)}
                >
                    <h2>Bath Towel</h2>
                    <div className="count-info">
                        <p>TH: 400</p>
                        <p>NW: 450</p>
                        <p className="success-text">RM: 0</p>
                        <p className="danger-text">EX: 50</p>
                    </div>
                </div>
            </div>

            <div className="floating-add-btn">+</div>

            <div className={`bottom-nav ${showBottomNav ? "active" : ""}`}>
                <div className="close-area" onClick={() => setShowBottomNav(false)}></div>
                <div className="nav-content">
                    <div className="bottom-nav-item">Edit</div>
                    <div className="bottom-nav-item color-red">Delete</div>
                    <div className="bottom-nav-item">Details</div>
                    <div className="bottom-nav-item">Update CR</div>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default SubjectIndexPage;