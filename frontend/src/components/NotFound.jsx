import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const toHome = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>Page Not Found</h1>
      <button onClick={toHome}>Home</button>
    </div>
  );
};

export default NotFound;
