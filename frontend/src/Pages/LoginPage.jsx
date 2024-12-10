import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom, accessLevelAtom } from "../atoms";
import Message from "../components/Message";

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

  // Wipes error message when user starts re-entering information
  useEffect(() => {
    setErrorMessage(null);
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
        setAccessToken(response.accessToken);
        setAccessLevel(response.accessLevel);
        setLoginEmail("");
        setLoginPassword("");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 401) {
          setErrorMessage("Invalid email or password")
        }
        else {
          setErrorMessage("Error authenticating request, please try again later")
        }
      });
  };

  return (
    <div className="form-box">
      <h2>Log In</h2>
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
        <Message message={errorMessage} type="error" />
        <button type="submit">Log In</button>
        <p>Don't have an account?</p>
        <button type="button" onClick={toSignUp}>
          Sign Up Now!
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
