import Navbar from "./shared/Navigation/Navbar";
import { Outlet } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import Footer from "./shared/footer/Footer";
const Layout = () => {
  return (
    <>
      <div>
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          declineButtonText="Reject"
          cookieName="user-consent"
          style={{ background: "#2B373B" }}
          buttonStyle={{
            backgroundColor: "#4CAF50",
            color: "white",
            fontSize: "13px",
            borderRadius: "5px",
          }}
          declineButtonStyle={{
            backgroundColor: "#f44336",  // Red button için renk
            color: "white",
            fontSize: "13px",
            borderRadius: "5px",
          }}
        >
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
        </CookieConsent>
        {/* Diğer sayfa içeriğiniz */}
      </div>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
