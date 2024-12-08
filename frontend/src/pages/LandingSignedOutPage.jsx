import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const LandingSignedOutPage = () => {
  const navigate = useNavigate();
  const toLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      Landing Page (real) - you are signed out
      <button onClick={toLogin}>Login</button>
    </div>
  );
};

export default LandingSignedOutPage;
