import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom, accessLevelAtom } from "../atoms";

const LoginPage = () => {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setAccessLevel = useSetAtom(accessLevelAtom);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Removes the display of any the display error message when users start typing in either fields
  useEffect(() => {
    setErrorMessage("");
  }, [loginEmail, loginPassword]);

  const toSignUp = () => {
    navigate("/sign-up");
  };

  const login = (event) => {
    event.preventDefault();
    const loginAccount = {
      email: loginEmail,
      password: loginPassword,
    };
    platformApi
      .authLogin(loginAccount)
      .then((response) => {
        console.log(response.accessLevel)
        setAccessToken(response.accessToken);
        setAccessLevel(response.accessLevel);
        setLoginEmail("");
        setLoginPassword("");
        navigate("/");
      })
      .catch((error) => {
        console.log("ERROR WITH LOGIN");
        console.log(error);
      });
  };

  return (
    <div className="form-box">
      <h2>Log In</h2>
      <p>{errorMessage}</p>
      <form onSubmit={login}>
        <label htmlFor="loginEmail">Email</label>
        <input
          id="loginEmail"
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
          type="email"
        />
        <label htmlFor="loginPassword">Password</label>
        <input
          id="loginPassword"
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
          type="password"
        />
        <button type="submit">Log In</button>
        <p>Don't have an account?</p>
        <button type="button" onClick={toSignUp}>
          Create Account
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
