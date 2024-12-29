import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAtomValue } from "jotai";

import Layout from "./components/Layout";
import LandingDirectory from "./components/LandingDirectory";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminDirectory from "./components/AdminDirectory";
import NotFound from "./components/NotFound";

import { accessLevelAtom, accessTokenAtom } from "./atoms";
import AttemptPage from "./pages/AttemptPage";

const App = () => {
  const accessLevel = useAtomValue(accessLevelAtom);
  const accessToken = useAtomValue(accessTokenAtom);

  // Save Access Level and Access Token to session storage whenever their state changes
  useEffect(() => {
    accessLevel
      ? sessionStorage.setItem("accessLevel", accessLevel)
      : sessionStorage.removeItem("accessLevel");
  }, [accessLevel]);

  useEffect(() => {
    accessToken
      ? sessionStorage.setItem("accessToken", accessToken)
      : sessionStorage.removeItem("accessToken");
  }, [accessToken]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<LandingDirectory />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="admin" element={<AdminDirectory />} />
        <Route path="event" element={<AttemptPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
