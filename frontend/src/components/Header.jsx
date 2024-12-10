import AuthButton from "./AuthButton";

const Header = () => {
  // Styling for header tag found in index.css file

  const title = {
    marginBlock: 0,
  };

  return (
    <header>
      <h1 style={title}>NZPMC</h1>
      <AuthButton />
    </header>
  );
};

export default Header;
