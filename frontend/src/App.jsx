import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import LandingDirectory from "./components/LandingDirectory";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminDirectory from "./components/AdminDirectory";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<LandingDirectory />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="admin" element={<AdminDirectory />} />
      </Route>
    </Routes>
  );
};

export default App;
