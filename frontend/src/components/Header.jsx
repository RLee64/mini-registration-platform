import AuthButton from "./AuthButton";
import logo from "../images/logo.png";

const Header = () => {
  // Styling for header tag found in index.css file

  const flexBoxWrapper = {
    display: "flex",
    alignItems: "center",
    gap: 10,
  }

  const title = {
    marginBlock: 0,
  };

  return (
    <header>
      <span style={flexBoxWrapper}>
        <img src={logo} alt="Logo" />
        <h1 style={title}>NZPMC</h1>
      </span>
      <AuthButton />
    </header>
  );
};

export default Header;
