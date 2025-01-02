import { useAtom, useSetAtom } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";

import { accessTokenAtom, accessLevelAtom } from "../atoms";

// Button found in header that directs user to login page or allows them to sign out
const AuthButton = () => {
    const setAccessToken = useSetAtom(accessTokenAtom);
    const [accessLevel, setAccessLevel] = useAtom(accessLevelAtom);
  
    const navigate = useNavigate();
  
    const currentPath = useLocation().pathname;
    const disableAuthButton =
      currentPath === "/login" || currentPath === "/sign-up";
    const enableHomeButton = currentPath.startsWith("/event")
  
    const toLogin = () => {
      navigate("/login");
    };
  
    const signOut = () => {
      setAccessToken(null);
      setAccessLevel(null);
    };

    const toHome = () => {
      navigate("/")
    }
  
    if (disableAuthButton) {
      return null;
    }

    if (enableHomeButton) {
      return <button onClick={toHome}>Home</button>
    }

    return accessLevel ? (
      <button onClick={signOut}>Sign Out</button>
    ) : (
      <button onClick={toLogin}>Login</button>
    );
  };

  export default AuthButton