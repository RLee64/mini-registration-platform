import { useState } from "react";
import { useNavigate } from "react-router-dom";

import platformApi from "../Services/platform-api";

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

    platformApi.postAccount(newAccount).then((returnedAccount) => {
      clearAccountFields();
      navigate("/login");
    });
  };

  return (
    <div>
      Sign Up to NZPMC
      <form onSubmit={createAccount}>
        name{" "}
        <input
          value={newAccountName}
          onChange={(event) => setNewAccountName(event.target.value)}
        />
        email{" "}
        <input
          value={newAccountEmail}
          onChange={(event) => setNewAccountEmail(event.target.value)}
          type="email"
        />
        password{" "}
        <input
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
