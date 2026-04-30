import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import SideNavButton from "./SideNavButton";

const SideNav: React.FC = () => {

    const { logout } = useAuthStore()
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        logout();
        navigate("/login");
    };

    return (
        <div className="nav" >
            <ul className="sidenav">
                <SideNavButton title="Profile" icon="fa-solid fa-address-card" href="/admin/profile" />
                <SideNavButton title="Categories" icon="fa-solid fa-car" href="/admin/categories" />
                <SideNavButton title="Subjects" icon="fa-solid fa-book" href="/admin/subjects" />
                <SideNavButton title="Break Points" icon="fa-solid fa-chart-line" href="/admin/break_points" />
                <SideNavButton title="Users" icon="fa-solid fa-user" href="/admin/users" />
                <SideNavButton title="Settings" icon="fa-solid fa-gear" href="/admin/settings" />
                <li onClick={handleLogout}>
                    <a className="nav-link" href="#" data-discover="true">
                        <i className="fa-solid fa-sign-out-alt"></i>
                        <span className="menu-title">Logout</span>
                    </a>
                </li>

            </ul>
        </div >
    );
}

export default SideNav;
