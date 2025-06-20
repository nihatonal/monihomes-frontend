import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const PageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    window.gtag('config', 'G-2L848WK06N', {
      page_path: location.pathname,
    });
  }, [location]);
};

export default PageTracking;