import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [loginName, setLoginName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const navigate = useNavigate()

  const toSignUp = () => {
    navigate('/sign-up')
  }

  //replace soon
  const TEMPLOGIN = (event) => {
    event.preventDefault()
  }

  return (
    <div>
      Login Page
      <form onSubmit={TEMPLOGIN}>
        email <input value={loginName} onChange={setLoginName} />
        password <input value={loginEmail} onChange={setLoginEmail} />
        <button type="submit">Login</button>
        <button onClick={toSignUp}>Create Account</button>
      </form>
    </div>
  );
};

export default LoginPage;
