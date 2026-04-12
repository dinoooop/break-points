import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNav from "../one/SideNav";
import ProfilePic from "../one/ProfilePic";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import { useSvStore } from "../../helpers/sv/useSvStore";

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
    const themeIcon = "sample";
    const { user, checkAuth } = useAuthStore()

    // const { svData, regular } = useSvStore();

    const navigate = useNavigate()

    useEffect(() => {
        checkAuth()

        // if (!svData) { regular() }

        if (!user) {
            navigate('/login')
        }
    }, [user])

    return (
        <div className="container container-admin">
            <aside id="sidenav" className={viewSidenav ? "display-aside" : ""}>
                <div className="nav-section">

                    <div className="nav-section-nav">
                        <div className="nav-section-header">
                            <img
                                src="/images/avatar.png"
                                loading="lazy"
                                className="profile-pic"
                            />
                            <h3 className="profile-name">John Doe</h3>
                        </div>

                        <SideNav />
                    </div>
                    <div className="nav-section-close" onClick={() => setViewSideNav(!viewSidenav)}></div>
                </div>
            </aside>

            <main>
                <div className="topnav bg-theme">
                    <div className="topnav-left">
                        {dashParams.hasBack &&
                            <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
                        }
                        <h2 className="header-title">{dashParams.title}</h2>
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

                <div className="content">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
