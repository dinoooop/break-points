import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../helpers/stores/useAuthStore";
import config from "../../config";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200); // Shrink after scrolling 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header bg-grey ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <Link to="/">{config.appName}</Link>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/cars">Cars</a>
          <a href="/contact">Contact</a>

          {/* ✅ Conditionally render Login or Logout */}
          {user ? (
            user.is_staff ? (
              <Link to="/admin/cars" className="signin">
                Admin
              </Link>
            ) : (   
            <Link to="/account/cars" className="signin">
              Account
            </Link>
          )) : (
            <Link to="/login" className="signin">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;