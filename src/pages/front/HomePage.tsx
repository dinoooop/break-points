import React, { useEffect } from "react";
import { useSvStore } from "../../helpers/sv/useSvStore";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {

  const { regular } = useSvStore();

  useEffect(() => {
    regular()
  }, [])

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header bg-dark">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="Break Point Logo" />
          </Link>
        </div>

        <div className="header-actions">
          <Link to="/login" className="btn bg-theme">
            Login
          </Link>
        </div>
      </header>

      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          <h2>Track Usage Intervals Smarter</h2>

          <p>
            Break Point helps you track repeated products like LPG cylinders,
            oil changes, filters, batteries and more.
          </p>

          <div className="banner-card">

            <div>
              <h3>Built Mainly for Mobile Users</h3>

              <p>
                Install the PWA on your phone for the best experience and quick
                access anytime.
              </p>
              <button className="btn">Install PWA</button>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about">
        <div className="section-title">
          <h2>What is Break Point?</h2>
          <p>Simple interval tracking for daily life products.</p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="card-icon">
              <i className="fa-solid fa-calendar-days"></i>
            </div>

            <h3>Day Based Tracking</h3>

            <p>
              Track how many days your current LPG cylinder has been running and
              estimate when it may finish.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">
              <i className="fa-solid fa-folder-closed"></i>
            </div>

            <h3>Usage History</h3>

            <p>
              Store previous intervals and analyze your average product usage
              patterns over time.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">
              <i className="fa-solid fa-gauge-high"></i>
            </div>

            <h3>Unit Based Tracking</h3>

            <p>
              Track products using units like KM for bike oil changes, machine
              maintenance, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Break Point. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;