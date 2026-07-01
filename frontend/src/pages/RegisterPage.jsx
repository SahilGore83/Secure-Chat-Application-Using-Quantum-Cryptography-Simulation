import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosClient";
import "../styles/Auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="auth-close">×</button>
        <h2 className="auth-title">Register</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <div className="auth-label-row">
              <span>
                <span>Username</span>
                <span className="auth-icon">👤</span>
              </span>
            </div>
            <input
              className="auth-input"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="auth-label-row">
              <span>
                <span>Mobile No</span>
                <span className="auth-icon">📞</span>
              </span>
            </div>
            <input
              className="auth-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="auth-label-row">
              <span>
                <span>Password</span>
                <span className="auth-icon">🔒</span>
              </span>
            </div>
            <input
              className="auth-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;