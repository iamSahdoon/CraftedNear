import logout from "../../assets/svgs/logout.svg";
import PropTypes from "prop-types";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const HeroCustomer = ({ name, title, email, points, location }) => {
  const { logoutCustomer } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutCustomer();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <>
      <div className="name-logout-wrapper">
        <p>{name}</p>
        <button onClick={handleLogout}>
          <img src={logout} alt="logout_icon" />
        </button>
      </div>
      <div className="customer-details-wrapper1">
        <p>CURRENT TITLE : {title}</p>
        <p>EMAIL : {email}</p>
      </div>
      <div className="customer-details-wrapper2">
        <p>CURRENT POINTS : {points} </p>
        <p>LOCATION : {location}</p>
      </div>
    </>
  );
};

HeroCustomer.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
};

export default HeroCustomer;
