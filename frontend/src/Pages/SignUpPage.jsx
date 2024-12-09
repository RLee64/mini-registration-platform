import { useState } from "react";
import { useNavigate } from "react-router-dom";

import platformApi from "../services/platform-api";

const SignUpPage = () => {
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountPassword, setNewAccountPassword] = useState("");

  const navigate = useNavigate();

  const clearAccountFields = () => {
    setNewAccountName("");
    setNewAccountEmail("");
    setNewAccountPassword("");
  };

  const createAccount = (event) => {
    event.preventDefault();
    console.log("Creating account");

    const newAccount = {
      name: newAccountName,
      email: newAccountEmail,
      password: newAccountPassword,
    };

    platformApi.postAccount(newAccount).then(() => {
      clearAccountFields();
      navigate("/login");
    });
  };

  return (
    <div className="form-box">
      <h2>Sign Up to The NZPMC</h2>
      <form onSubmit={createAccount}>
        <label htmlFor="signUpName">Name</label>
        <input
          id="signUpName"
          value={newAccountName}
          onChange={(event) => setNewAccountName(event.target.value)}
          type="text"
        />
        <label htmlFor="signUpEmail">Email</label>
        <input
          id="signUpEmail"
          value={newAccountEmail}
          onChange={(event) => setNewAccountEmail(event.target.value)}
          type="email"
        />
        <label htmlFor="signUpPassword">Password</label>
        <input
          id="signUpPassword"
          value={newAccountPassword}
          onChange={(event) => setNewAccountPassword(event.target.value)}
          type="password"
        />
        {/*When creating account make sure to redirect back to login page*/}
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default SignUpPage;
