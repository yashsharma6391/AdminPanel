import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkAuth, checkAdminExists } from "../../services/Service";
const AdminPoint = import.meta.env.VITE_ACCESS_POINT_ADMIN;
const BackendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authorized = await checkAuth();
      if (authorized) {
        navigate("/list");
        return;
      }
      
      // If not authorized, check if admin exists
      const adminExists = await checkAdminExists();
      if (!adminExists) {
        // No admin in DB, redirect to create admin
        navigate("/");
        return;
      }
      
      setChecking(false);
    };
    verifyAuth();
  }, [navigate]);

  if (checking) return <div className="text-center mt-5">Checking login status...</div>;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${BackendUrl}${AdminPoint}/login`,
        { email, password },
        { withCredentials: true } //  important to get cookie
      );

      // login successful (console removed)
      toast.success("Login successful! Redirecting...");
      if (onLoginSuccess) onLoginSuccess();
      navigate("/list"); // redirect to list after login
    } catch (err) {
      // login error (console removed)
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Admin Login</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
             <button
              type="button"
              className="btn btn-primary w-100 gap-3 mt-3"
              onClick={() => navigate("/forgot-password")}
              
            >
              Forgot Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
