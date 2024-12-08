import { useAtom, useSetAtom } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";

import { accessTokenAtom, accessLevelAtom } from "../atoms";

const AuthButton = () => {
    const setAccessToken = useSetAtom(accessTokenAtom);
    const [accessLevel, setAccessLevel] = useAtom(accessLevelAtom);
  
    const navigate = useNavigate();
  
    const currentPath = useLocation().pathname;
    const disableAuthButton =
      currentPath === "/login" || currentPath === "/sign-up";
  
    const toLogin = () => {
      navigate("/login");
    };
  
    const signOut = () => {
      setAccessToken(null);
      setAccessLevel(null);
    };
  
    if (disableAuthButton) {
      return null;
    }
    return accessLevel ? (
      <button onClick={signOut}>Sign Out</button>
    ) : (
      <button onClick={toLogin}>Login</button>
    );
  };

  export default AuthButton