import { Link } from "react-router-dom";
import React from "react";

interface SideNavButtonProps {
  href: string;
  title: string;
  icon?: string;
}

const SideNavButton: React.FC<SideNavButtonProps> = ({ href, title, icon }) => {
  const iconClass = icon ?? "fa-solid fa-circle";

  return (
    <li>
      <Link className="nav-link" to={href}>
        <i className={iconClass}></i>
        <span className="menu-title">{title}</span>
      </Link>
    </li>
  );
};

export default SideNavButton;
