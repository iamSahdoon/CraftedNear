import "./Map.css";
import PropTypes from "prop-types";
import google_img from "../../assets/images/map.png";

const Map = () => {
  return (
    <>
      <img src={google_img} alt="google" />
    </>
  );
};

Map.propTypes = {
  google_img: PropTypes.string.isRequired,
};

export default Map;
