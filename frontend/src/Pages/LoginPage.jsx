import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import platformApi from "../services/platform-api";
import useAuth from "../hooks/use-auth";

const LoginPage = () => {
  const { setAuth } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  //Removes the display of any the display error message when users start typing in either fields
  useEffect(() => {
    setErrorMessage("");
  }, [loginEmail, loginPassword]);

  //Redirect user to sign-up page
  const toSignUp = () => {
    navigate("/sign-up");
  };

  const login = (event) => {
    event.preventDefault();
    const loginAccount = {
      email: loginEmail,
      password: loginPassword,
    };
    platformApi.authLogin(loginAccount).then((response) => {
      setAuth({
        email: response.email,
        password: response.password,
        roles: response.roles,
        accessToken: response.accessToken,
      });
      setLoginEmail("");
      setLoginPassword("");
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
        <button onClick={toSignUp}>Create Account</button>
      </form>
    </div>
  );
};

export default LoginPage;
