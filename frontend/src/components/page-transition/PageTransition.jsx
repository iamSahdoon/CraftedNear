import "./PageTransition.css";
import { useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";

// Wraps every page: replays a subtle entrance animation on each navigation
// and starts newly visited pages at the top (Back/Forward keep their place).
const PageTransition = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType !== "POP") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, navigationType]);

  return (
    <div className="page-transition" key={pathname}>
      <Outlet />
    </div>
  );
};

export default PageTransition;
