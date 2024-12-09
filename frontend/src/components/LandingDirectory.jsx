import { useAtomValue } from "jotai";
import { Navigate, useLocation } from "react-router-dom";

import { accessLevelAtom } from "../atoms";
import LandingSignedInPage from "../pages/LandingSignedInPage";
import LandingSignedOutPage from "../pages/LandingSignedOutPage";

// Depending on whether user is signed in or not, display the appropriate page
const LandingPage = () => {
  const location = useLocation();
  const accessLevel = useAtomValue(accessLevelAtom);
  console.log(accessLevel)
  if (!accessLevel) {
    console.log("Signed Out")
    return <LandingSignedOutPage />;
  }
  if (accessLevel === "admin") {
    console.log("User is an admin")
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  console.log("Signed In")
  return <LandingSignedInPage />;
};

export default LandingPage;
