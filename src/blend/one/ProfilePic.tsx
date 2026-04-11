import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import { outer } from "../../helpers/cssm/outer";

const ProfilePic: React.FC = () => {

    const navigate = useNavigate();
    const { logout, user } = useAuthStore()

    const [view, setView] = useState(false);
    const picRef = useRef<HTMLImageElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const onClickToggler = () => {
        setView((prev) => !prev);
    }

    const handleDocumentClick = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
            view &&
            picRef.current &&
            dropdownRef.current &&
            !picRef.current.contains(target) &&
            !dropdownRef.current.contains(target)
        ) {
            setView(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [view]);

    return (
        <div className="dropdown-item" style={{ position: "relative" }}>
            <div onClick={onClickToggler}>
                <img
                                                                    src={`${outer.showImage(user?.avatar, 'cover')}`}
                                                                    alt={user?.full_name}
                                                                    loading="lazy"
                                                                    className="profile-pic"
                                                                />
            </div>

            {view && (
                <div className="dropdown" ref={dropdownRef}>
                    <div className="dropdown-arrow"></div>
                    <div className="list-button">
                        <Link to="/admin/profile">
                            <i className="fa-solid fa-user"></i> Profile
                        </Link>
                        <Link to="/admin/profile/security">
                            <i className="fa-solid fa-lock"></i> Security
                        </Link>
                        <div className="link" onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

export default ProfilePic;