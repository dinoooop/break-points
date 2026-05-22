import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../one/SideNav";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import { outer } from "../../helpers/cssm/outer";

interface DashboardLayoutProps {
    children: ReactNode;
    dashParams: {
        title: string;
        hasBack: boolean;
        hasMenu: boolean;
    }
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, dashParams }) => {


    const [viewSidenav, setViewSideNav] = useState<boolean>(false);
    const { user, checkAuth } = useAuthStore()

    const navigate = useNavigate()

    useEffect(() => {
        checkAuth()

        if (!user) {
            navigate('/login')
        }
    }, [user])

    return (
        <div className="container-admin">
            <aside id="sidenav" className={viewSidenav ? "display-aside" : ""}>
                <div className="nav-section bg-theme">
                    <div className="nav-section-nav">
                        <div className="nav-section-header">
                            <img
                                src={`${outer.showImage(user?.avatar, "thumb")}`}
                                loading="lazy"
                                className="profile-pic"
                            />
                            <h3 className="profile-name">{user?.first_name}</h3>
                        </div>
                        <SideNav />
                    </div>
                    <div className="nav-section-close" onClick={() => setViewSideNav(!viewSidenav)}></div>
                </div>
            </aside>

            <div className="container">
                <main className="bg-dark">
                    <div className="topnav bg-theme">
                        <div className="topnav-left">
                            {dashParams.hasBack &&
                                <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
                            }
                            <h2>{dashParams.title}</h2>
                        </div>
                        <div className="topnav-right">

                            {dashParams.hasMenu &&
                                <div
                                    className="menu"
                                    id="menu"
                                    onClick={() => setViewSideNav(!viewSidenav)}
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </div>
                            }

                        </div>
                    </div>

                    <div className="content bg-dark">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
