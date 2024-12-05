import { useState } from "react";

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

const LandingPage = () => {
  /*
  An option, but consider implementing protected routes instead
  
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, [navigate, currentUser]);
  
  */

  return <div>Landing Page (real)</div>;
};

export default LandingPage;
