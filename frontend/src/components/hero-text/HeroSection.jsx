import "./HeroSection.css";
import PropTypes from "prop-types";

const HeroSection = ({ herotext }) => {
  return (
    <>
      <div className="hero-section-CM">
        <div className="hero-text-container-CM">
          <h1>{herotext}</h1>
        </div>
      </div>
    </>
  );
};

HeroSection.propTypes = {
  herotext: PropTypes.string.isRequired,
};

export default HeroSection;
