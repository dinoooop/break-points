import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../helpers/stores/useAuthStore";

interface BlankDashboardLayoutProps {
    children: ReactNode;
}

const BlankDashboardLayout: React.FC<BlankDashboardLayoutProps> = ({ children }) => {
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
            <div className="container ">
                <main>
                    <div className="content">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default BlankDashboardLayout;
