import { useEffect, useState } from "react";

import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import ListFood from "./pages/ListService/ListService";
import Orders from "./pages/Orders/Orders";
import Sidebar from "./components/Sidebar/Sidebar";
import Menubar from "./components/Menubar/Menubar";
import { ToastContainer, toast } from "react-toastify";
import AddService from "./pages/AddService/AddService";
import Update from "./pages/ServiceUpdate/Update";
import LoginPage from "./pages/LoginPage/LoginPage";
import ResetPassword from "./pages/ForgotPassward/ResetPassword";
import ForgotPassword from "./pages/ForgotPassward/ForgotPassword";
import AdminCreate from "./pages/AdminCreate/AdminCreate";
import { checkAdminExists, checkAuth } from "./services/Service";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate()
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const isAuthorized = await checkAuth();
  //       if (!isAuthorized) {
  //         toast.error("Please login first");
  //         return navigate("/login"); // redirect if not authorized
  //       }
  
  //       // Only fetch list if authorized
  //       await fetchList();
  //     } catch (err) {
  //       console.log(err);
  //       toast.error("Error verifying auth");
  //       navigate("/login");
  //     }
  //     // finally{
  //     //   setLoading(false);
  //     // }
  //   };
  
  //   init();
  // }, []);

  //  useEffect(() => {
  //     const init = async () => {
  //       try {
  //         const exists = await checkAdminExists();
  //         if (exists) {
  //           toast.info("Admin already exists, redirecting to login");
  //           navigate("/Login");
  //         } else {
  //           navigate("/create-admin") // show form if no admin exists
  //         }
  //       } catch (err) {
  //         toast.error("Error checking admin existence");
  //       } 
  //     };
  //     init();
  //   }, [navigate]);
  return (
    <>
      <div className="d-flex" id="wrapper">
        <Sidebar sidebarVisible={sidebarVisible} />

        <div id="page-content-wrapper">
          <Menubar toggleSidebar={toggleSidebar} />
          <ToastContainer />
          <div className="container-fluid">
            <Routes>
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/add" element={<AddService />} />
              <Route path="/list" element={<ListFood />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token"
                element={<ResetPassword />}
              />
               <Route path="/" element={<AdminCreate />} />
              <Route path="/orders" element={<Orders />} />
              {/* <Route path="/" element={<ListFood />} /> */}
              <Route path="/edit/:id" element={<Update />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
