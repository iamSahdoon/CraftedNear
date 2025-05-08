import "./HerotextLogin.css";
import PropTypes from "prop-types";

const HerotextLogin = ({ text }) => {
  return (
    <>
      <div className="hero-text-login">
        <h2>{text}</h2>
      </div>
    </>
  );
};

HerotextLogin.propTypes = {
  text: PropTypes.string.isRequired,
};

export default HerotextLogin;
