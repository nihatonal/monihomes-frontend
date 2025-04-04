import Navbar from "./shared/Navigation/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./shared/footer/Footer";
const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
