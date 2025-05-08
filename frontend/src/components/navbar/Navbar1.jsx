import "./Navbar1.css";
import CNlogo from "../../assets/navbar/CN_logo-cropped.svg";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { NavLink } from "react-router-dom";

const Navbar1 = () => {
  const { seller, customer } = useContext(StoreContext);

  return (
    <>
      <header>
        <div className="navbar">
          <NavLink to="/">
            <img src={CNlogo} alt="CN" />
          </NavLink>
          <div className="nav-links">
            <NavLink
              to="/stores"
              className={({ isActive }) =>
                isActive ? "nav-link bg-active" : "nav-link"
              }
            >
              STOREFRONTS
            </NavLink>
            <NavLink
              to="/offers"
              className={({ isActive }) =>
                isActive ? "nav-link bg-active" : "nav-link"
              }
            >
              OFFERS
            </NavLink>
            <NavLink
              to="/aboutus"
              className={({ isActive }) =>
                isActive ? "nav-link bg-active" : "nav-link"
              }
            >
              ABOUT US
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? "nav-link bg-active" : "nav-link"
              }
            >
              BECOME A SELLER
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link bg-active" : "nav-link"
              }
            >
              LOGIN
            </NavLink>
            <NavLink to="/signup" className="signup">
              SIGNUP
            </NavLink>
          </div>
        </div>

        {/* Conditionally render based on user type */}
        {(customer || seller) && (
          <div className="navbar-user-links">
            {customer && (
              <NavLink
                to="/Customer/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link bg-active" : "nav-link"
                }
              >
                CUSTOMER
              </NavLink>
            )}
            {seller && (
              <NavLink
                to="/Seller/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link bg-active" : "nav-link"
                }
              >
                SELLER
              </NavLink>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar1;
