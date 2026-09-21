import "./Navbar1.css";
import CNlogo from "../../assets/navbar/CN_logo-cropped.svg";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { NavLink } from "react-router-dom";

const Navbar1 = () => {
  const { seller, customer } = useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // While the mobile menu is open, lock page scroll and close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (e) => e.key === "Escape" && setMenuOpen(false);
    document.documentElement.classList.add("nav-open");
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.classList.remove("nav-open");
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header>
        <div className="navbar">
          <NavLink to="/">
            <img src={CNlogo} alt="CN" />
          </NavLink>
          <button
            type="button"
            className={menuOpen ? "menu-toggle is-open" : "menu-toggle"}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-toggle-bars" aria-hidden="true" />
          </button>
          <div
            id="primary-nav"
            className={menuOpen ? "nav-links is-open" : "nav-links"}
            onClick={(e) => e.target.closest("a") && setMenuOpen(false)}
          >
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
            {/* Mobile menu only; desktop shows these in navbar-user-links */}
            {customer && (
              <NavLink
                to="/Customer/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-user bg-active" : "nav-link nav-link-user"
                }
              >
                MY PROFILE
              </NavLink>
            )}
            {seller && (
              <NavLink
                to="/Seller/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-user bg-active" : "nav-link nav-link-user"
                }
              >
                SELLER DASHBOARD
              </NavLink>
            )}
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
