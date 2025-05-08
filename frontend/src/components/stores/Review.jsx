import "./Review.css";
import review_star from "../../assets/svgs/review_star.svg";
import PropTypes from "prop-types";
const Review = ({ name, rating, comment }) => {
  return (
    <>
      <div className="review">
        <p className="reviewer-name">{name}</p>
        <div className="store-rating">
          <p className="cus-rating">{rating}</p>
          <img src={review_star} alt="" />
        </div>
        <p className="reviewer-comment">{comment}</p>
      </div>
    </>
  );
};

Review.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
};

export default Review;
