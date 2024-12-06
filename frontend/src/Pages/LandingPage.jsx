import useAuth from "../hooks/use-auth";
import LandingSignedInPage from "./LandingSignedInPage";
import LandingSignedOutPage from "./LandingSignedOutPage";

//Depending on whether user is signed in or not, display the appropriate page
const LandingPage = () => {
    const { auth } = useAuth();
    return (
        auth?.user
            ? <LandingSignedInPage />
            : <LandingSignedOutPage />
    )
}

export default LandingPage