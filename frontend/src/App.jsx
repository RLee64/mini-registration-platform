import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAtomValue } from "jotai";

import Layout from "./components/Layout";
import LandingDirectory from "./components/LandingDirectory";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminDirectory from "./components/AdminDirectory";

import { accessLevelAtom, accessTokenAtom } from "./atoms";

const App = () => {
  const accessLevel = useAtomValue(accessLevelAtom);
  const accessToken = useAtomValue(accessTokenAtom);

  // Save Access Level and Access Token to session storage whenever their state changes
  useEffect(() => {
    sessionStorage.setItem("accessLevel", accessLevel);
    sessionStorage.setItem("accessToken", accessToken);
  }, [accessLevel, accessToken]);

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
