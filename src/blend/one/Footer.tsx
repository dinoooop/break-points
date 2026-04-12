import React from "react";
import config from "../../config";

const Footer: React.FC = () => {
  return (
    <footer className="part bg-dark">

      <div className="wrapper">
        <div className="d-flex-start">
          <div className="footer-brand">
            <h3 className="logo">{config.appName}</h3>
            <p className="footer-desc">
              {config.appName} helps you find, compare, and purchase quality pre-owned cars with confidence.
              Reliable, certified, and trusted by thousands of happy customers.
            </p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/cars">Cars</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/login">Sign In</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: support@uc-garage.com</p>
            <p>Phone: +91 98765 43210</p>
            <div className="footer-social">
              <a href="#"><i className="fa-brands fa-facebook"></i></a>
              <a href="#"><i className="fa-brands fa-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin"></i></a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="footer-bottom text-center">
        <p>© {new Date().getFullYear()} {config.appName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;