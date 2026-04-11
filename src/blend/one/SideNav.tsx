import SideNavButton from "./SideNavButton";

const SideNav: React.FC = () => {

    return (
        <div className="nav" >
            <ul className="sidenav">
                <SideNavButton title="Profile" icon="fa-solid fa-address-card" href="/admin/profile" />
                <SideNavButton title="Categories" icon="fa-solid fa-car" href="/admin/categories" />
                <SideNavButton title="Users" icon="fa-solid fa-user" href="/admin/users" />
                <SideNavButton title="Settings" icon="fa-solid fa-gear" href="/admin/settings" />
                <SideNavButton title="Logout" icon="fa-solid fa-sign-out-alt" href="/login" />
                
            </ul>
        </div >
    );
}

export default SideNav;