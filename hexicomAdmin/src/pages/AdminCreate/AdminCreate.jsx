import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkAdminExists, checkAuth } from "../../services/Service";

const BackendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminCreate = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // hide form initially

  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const init = async () => {
      try {
        // First check if already logged in
        const isAuthorized = await checkAuth();
        if (isAuthorized) {
          // Already logged in, redirect to list
          navigate("/list");
          return;
        }

        // If not logged in, check if admin exists
        const exists = await checkAdminExists();
        if (exists) {
          toast.info("Admin already exists, Please login");
          navigate("/login");
        }else {
            if (!exists){
          toast.info("No Admin Please create one")
          setShowForm(true);
        }
          // show form if no admin exists
        }
      } catch (err) {
        toast.error("Error checking admin existence");
      } finally {
        setChecking(false); // done checking
      }
    };
    init();
  }, [navigate]);


  if (checking) return <div className="text-center mt-5">Checking...</div>;
  if (!showForm) return null; // hide form if admin exists

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BackendUrl}/api/admin/create`, { email, password });
      toast.success(res.data.message);
      navigate("/Login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Create Admin</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreate;
