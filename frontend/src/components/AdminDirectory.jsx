import { useAtomValue } from "jotai";
import { Navigate, useLocation } from "react-router-dom";

import { accessLevelAtom } from "../atoms";
import AdminPage from "../Pages/AdminPage";

// Directs user to correct path depending on access level
const AdminDirectory = () => {
  const location = useLocation();
  const accessLevel = useAtomValue(accessLevelAtom);
  if (!accessLevel) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (accessLevel === "admin") {
    return <AdminPage />;
  }
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminDirectory;
