import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const SignUpPage = () => {
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate()

  //replace soon
  const TEMPFUNCTION = (event) => {
    event.preventDefault()
    console.log("Time to add a person");
    navigate('/login')
  }

  return (
    <div>
      Sign Up to NZPMC
      <form onSubmit={TEMPFUNCTION}>
        name{" "}
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        email{" "}
        <input
          value={newEmail}
          onChange={(event) => setNewEmail(event.target.value)}
          type="email"
        />
        password{" "}
        <input
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          type="password"
        />
        {/*When creating account make sure to redirect back to login page*/}
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default SignUpPage;
