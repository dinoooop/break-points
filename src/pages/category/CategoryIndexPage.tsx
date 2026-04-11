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
import DisplayCalendar from "../../blend/formc/InputSingleDateCalendar";

const CategoryIndexPage: React.FC = () => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showBottomNav, setShowBottomNav] = useState(false);

    const dashParams = {
        title: "BREAK POINTS",
        hasBack: false,
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

    const handleOnClick = () => {
        // navigate to subjects like normal anchor click
        window.location.href = "/admin/subjects";
    }

    return (
        <DashboardLayout dashParams={dashParams}>
            <div className="body-content">
                <div className="card-mini bg-dark-hover"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={handleOnClick}
                    onDoubleClick={() => setShowBottomNav(true)}
                >
                    <div className="card-image">
                        <img src="/images/thumb.jpg" alt="Category" />
                    </div>
                    <div className="card-content">
                        <div className="title">Home items</div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, dolor repellendus! Quia facilis ipsam.</p>
                    </div>
                </div>

            </div>

            <div className="floating-add-btn">+</div>

            <div className={`bottom-nav ${showBottomNav ? "active" : ""}`}>
                <div className="close-area" onClick={() => setShowBottomNav(false)}></div>
                <div className="nav-content">
                    <div className="bottom-nav-item">Edit</div>
                    <div className="bottom-nav-item">Delete</div>
                    <div className="bottom-nav-item">Details</div>
                    <div className="bottom-nav-item">Update CR</div>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default CategoryIndexPage;