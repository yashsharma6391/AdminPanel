import React from "react";
import LoginForm from "../../components/Login/LoginForm";


const LoginPage = () => {
  const handleLoginSuccess = () => {
    // Redirect to dashboard or reload
    window.location.href = "/list";
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
};

export default LoginPage;
