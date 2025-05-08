import "./Title.css";
import location_icon from "../../assets/svgs/location_icon.svg";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Title = ({ text1, text2, text3, text4 }) => {
  return (
    <>
      <section className="stores-near">
        <div className="stores-near-headers">
          <h3>
            <span>{text1}</span>
            {text2}
          </h3>
          <div className="location-right-header">
            <div className="location-icon-wrapper">
              <img
                className="location-icon"
                src={location_icon}
                alt="location_icon"
              />
              <p>{text3}</p>
            </div>
            <Link to="/stores" className="viewall">
              {text4}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

Title.propTypes = {
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired,
  text3: PropTypes.string.isRequired,
  text4: PropTypes.string.isRequired,
};

export default Title;
