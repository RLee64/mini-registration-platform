import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const events = [
  {
    id: 1,
    name: "Potato",
    description: "Free potato",
    date: "30/02/25",
  },
  {
    id: 2,
    name: "Burger",
    description: "Pls buy my burger",
    date: "01/01/98",
  },
];

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
