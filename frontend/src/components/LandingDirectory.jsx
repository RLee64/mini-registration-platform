import { useAtomValue } from "jotai";
import { Navigate, useLocation } from "react-router-dom";

import { accessLevelAtom } from "../atoms";
import LandingSignedInPage from "../pages/LandingSignedInPage";
import LandingSignedOutPage from "../pages/LandingSignedOutPage";

// Depending on whether user is signed in or not, display the appropriate page
const LandingPage = () => {
  const location = useLocation();
  const accessLevel = useAtomValue(accessLevelAtom);
  if (!accessLevel) {
    return <LandingSignedOutPage />;
  }
  if (accessLevel === "admin") {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  return <LandingSignedInPage />;
};

export default LandingPage;
