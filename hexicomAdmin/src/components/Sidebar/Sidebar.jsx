import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { asserts } from '../../assets/asserts'
import { checkAuth, logoutAdmin } from "../../services/Service";
const Sidebar = ({sidebarVisible}) => {
   const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  
  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setIsLoggedIn(auth);
      // navigate("/list")
    };
    verifyAuth();
  }, []);

  // Re-verify auth every 30 seconds
  useEffect(() => {
    const authCheckInterval = setInterval(async () => {
      const auth = await checkAuth();
      setIsLoggedIn(auth);
    }, 30000);

    return () => clearInterval(authCheckInterval);
  }, []);

  const handleLogout = async () => {
    const success = await logoutAdmin();
    if (success) {
      toast.success("Logged out successfully");
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      toast.error("Logout failed");
    }
  };
  return (
     <div className={`border-end bg-white ${sidebarVisible ? '': 'd-none'}`} id="sidebar-wrapper">
                <div className="sidebar-heading border-bottom bg-light">
                    <img src={asserts.logo} alt="" height={50} width={50} />
                    <span className='align-item-center'>Admin</span>
                </div>
                
                <div className="list-group list-group-flush">
                    <Link className="list-group-item list-group-item-action list-group-item-light p-3" to={"/add"}>
                        <i className='bi bi-plus-circle m-2'></i>AddService</Link>
                    <Link className="list-group-item list-group-item-action list-group-item-light p-3" to={"/list"}>
                      <i className='bi bi-list-ul m-2'></i>List of Service</Link>
                    <Link className="list-group-item list-group-item-action list-group-item-light p-3" to={"/orders"}>
                    <i className='bi bi-file-earmark-text m-2'></i>Job Application</Link>
                    
                    {/* Auth Status Section */}
                    <div className="list-group-item list-group-item-light p-3 border-top mt-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="d-flex align-items-center">
                          <i className={`bi m-2 ${isLoggedIn ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-warning'}`}></i>
                          <span className="fw-semibold">
                            {isLoggedIn ? 'Logged In' : 'Not Logged In'}
                          </span>
                        </span>
                      </div>
                      <small className={`d-block mt-2 ${isLoggedIn ? 'text-success' : 'text-warning'}`}>
                        {isLoggedIn ? 'You have access to all features' : 'Please log in to continue'}
                      </small>
                    </div>

                    {/* Auth Button */}
                    {isLoggedIn ? (
                      <button 
                        className="list-group-item list-group-item-action list-group-item-light p-3 text-danger fw-semibold"  
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className='bi bi-box-arrow-right m-2'></i>Logout
                      </button>
                    ) : (
                      <button 
                        className="list-group-item list-group-item-action list-group-item-light p-3 text-primary fw-semibold"
                        onClick={() => navigate("/login")}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className='bi bi-box-arrow-in-right m-2'></i>Login
                      </button>
                    )}
                </div>
            </div>
  )
}

export default Sidebar