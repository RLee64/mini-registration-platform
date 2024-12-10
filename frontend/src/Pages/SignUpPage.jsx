import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import platformApi from "../services/platform-api";
import ErrorMessage from "../components/ErrorMessage";

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

    let newErrorMessage = "";
    if (
      !newAccountName ||
      !newAccountEmail ||
      !newAccountPassword ||
      !confirmPassword
    ) {
      newErrorMessage += "- Please Fill in All Boxes ";
    }
    if (newAccountPassword !== confirmPassword) {
      newErrorMessage += "- Passwords do not match ";
    }

    if (newErrorMessage) {
      setErrorMessage(`ERROR ${newErrorMessage}`);
      return;
    }

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
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          type="password"
        />
        <ErrorMessage message={errorMessage} />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default SignUpPage;
