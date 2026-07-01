import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const particles = Array.from({ length: 18 });

const HomePage = () => {
  const logoRef = useRef(null);

const handleMouseMove = (e) => {
  if (!logoRef.current) return;

  const rect = logoRef.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = e.clientX - centerX;
  const deltaY = e.clientY - centerY;
  const rotateY = Math.max(-10, Math.min(10, deltaX / 35));
  const rotateX = Math.max(-10, Math.min(10, -deltaY / 35));

  logoRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
};

  const handleMouseLeave = () => {
    if (!logoRef.current) return;
    logoRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div
      className="home-page"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="home-particles">
        {particles.map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: `${(index * 7) % 100}%`,
              animationDelay: `${index * 0.6}s`,
              animationDuration: `${8 + (index % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="home-card">
        <div className="home-logo-scene">
          <img
            ref={logoRef}
            src="../../public/logo.svg"
            alt="Qchat Logo"
            className="home-logo"
          />
        </div>

        <h1 className="home-title glow-text">Qchat</h1>

        <p className="home-subtitle reveal delay-1">
          A secure chat application powered by quantum cryptography simulation.
        </p>

        <p className="home-description reveal delay-2">
          Connect, chat, and protect every conversation using a BB84-inspired
          key exchange model and strong encryption behind the scenes.
        </p>

        <div className="home-buttons reveal delay-3">
          <Link to="/login" className="home-btn home-btn-primary">
            Login
          </Link>
          <Link to="/register" className="home-btn home-btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;