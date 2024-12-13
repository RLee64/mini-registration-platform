import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import platformApi from "../services/platform-api";
import Message from "../components/Message";

const SignUpPage = () => {
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountPassword, setNewAccountPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  // Wipes error message when user starts re-entering information
  useEffect(() => {
    setErrorMessage(null);
  }, [newAccountName, newAccountEmail, newAccountPassword, confirmPassword]);

  const clearAccountFields = () => {
    setNewAccountName("");
    setNewAccountEmail("");
    setNewAccountPassword("");
  };

  const createAccount = (event) => {
    event.preventDefault();

    if (
      !newAccountName ||
      !newAccountEmail ||
      !newAccountPassword ||
      !confirmPassword
    ) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    if (newAccountPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const newAccount = {
      name: newAccountName,
      email: newAccountEmail,
      password: newAccountPassword,
    };

    platformApi
      .postAccount(newAccount)
      .then(() => {
        clearAccountFields();
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Error - Account could not be created");
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
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          type="password"
        />
        <Message message={errorMessage} type="error" />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default SignUpPage;
