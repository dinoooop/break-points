import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../helpers/stores/useAuthStore";
import NotFoundPage from "../../pages/front/NotFoundPage";
import { useSvStore } from "../../helpers/sv/useSvStore";

interface AccountProtectedLayoutProps {
    children: ReactNode;
    statusCode?: number
}

const AccountProtectedLayout: React.FC<AccountProtectedLayoutProps> = ({ children, statusCode = 200 }) => {

    const { user, checkAuth } = useAuthStore()
    const { svData, regular } = useSvStore();

    const navigate = useNavigate()


    useEffect(() => {
        checkAuth()

        if (!svData) { regular() }

        if (!user) {
            navigate('/login')
        }
    }, [user])

    return (
        <>
            {
                statusCode == 404 ?
                    <NotFoundPage />
                    :
                    <div className="front account-page">
                        {children}
                    </div>

            }
        </>
    )
};

export default AccountProtectedLayout;
