import { useNavigate } from "react-router-dom";

import AuthButton from "./AuthButton";
import logo from "../images/logo.png";

const Header = () => {
  const navigate = useNavigate();

  // Styling for header tag can be found in the index.css file

  // Flex box for span that also shows indication of it being clickable
  const flexBoxWrapper = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  };

  const title = {
    marginBlock: 0,
  };

  const toHome = () => {
    navigate("/");
  };

  return (
    <header>
      <span style={flexBoxWrapper} onClick={toHome}>
        <img src={logo} alt="Logo" />
        <h1 style={title}>NZPMC</h1>
      </span>
      <AuthButton />
    </header>
  );
};

export default Header;
