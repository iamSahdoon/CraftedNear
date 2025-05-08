import star_icon from "../../assets/svgs/star_icon.svg";
import "./Batch.css";
import PropTypes from "prop-types";

const Batch = ({ batches }) => {
  return (
    <>
      {batches.map((batch_name, index) => (
        <div key={index} className="trophie-box">
          <img src={star_icon} alt="" />
          <p>{batch_name}</p>
        </div>
      ))}
    </>
  );
};

Batch.propTypes = {
  batches: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Batch;
