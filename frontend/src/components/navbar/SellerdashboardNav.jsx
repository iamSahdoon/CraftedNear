import "./SellerdashboardNav.css";

import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import CNlogo from "../../assets/navbar/CN_logo-cropped.svg";

const SellerdashboardNav = () => {
  const { seller, logoutSeller } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutSeller();
    navigate("/login");
  };

  return (
    <>
      <header>
        <div className="navbar">
          <NavLink to="/">
            <img src={CNlogo} alt="CN" />
          </NavLink>
          <div className="left-nav-wrapper">
            <p className="seller-name">{seller?.name}</p>
            <button onClick={handleLogout} className="logout">
              LOGOUT
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default SellerdashboardNav;
