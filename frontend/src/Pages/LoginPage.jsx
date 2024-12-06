import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import platformApi from "../services/platform-api";

const LoginPage = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

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
      password: loginPassword
    }
    platformApi.authenticateLogin(loginAccount).then((returnedData) => {
      //do smth I guess
      setLoginEmail("");
      setLoginPassword("");
    });
  };

  return (
    <div>
      Login Page
      <p>{errorMessage}</p>
      <form onSubmit={login}>
        email{" "}
        <input
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
          type="email"
        />
        password{" "}
        <input
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
          type="password"
        />
        <button type="submit">Login</button>
        <button onClick={toSignUp}>Create Account</button>
      </form>
    </div>
  );
};

export default LoginPage;
