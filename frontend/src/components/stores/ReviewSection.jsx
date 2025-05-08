import { useState, useEffect, useContext } from "react";
import Review from "./Review";
import review_star from "../../assets/svgs/review_star.svg";
import { StoreContext } from "../../context/StoreContext";
import { useLocation } from "react-router-dom";

const ReviewSection = () => {
  const location = useLocation();
  const sellerData = location.state?.sellerData;
  const {
    createReview,
    reviews,
    fetchReviews,
    customer,
    updateCustomerPoints,
  } = useContext(StoreContext);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 0,
    comment: "",
  });
  const [selectedRating, setSelectedRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (sellerData?._id) {
      fetchReviews(sellerData._id);
    }
  }, [sellerData, fetchReviews]);

  const handleStarClick = async (rating) => {
    setSelectedRating(rating);
    setReviewForm((prev) => ({ ...prev, rating }));

    // Award points if customer is logged in
    if (customer) {
      await updateCustomerPoints(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!reviewForm.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!reviewForm.rating) {
      setError("Please select a rating");
      return;
    }

    try {
      const result = await createReview({
        sellerId: sellerData._id,
        ...reviewForm,
      });

      if (result.success) {
        setSuccess("Review submitted successfully!");
        // Reset form
        setReviewForm({ name: "", rating: 0, comment: "" });
        setSelectedRating(0);
      } else {
        setError(result.message || "Failed to submit review");
      }
    } catch (error) {
      setError(error.message || "Failed to submit review");
    }
  };

  return (
    <>
      <div className="review-container">
        <h3>How are you feeling?</h3>
        <p>
          Your input and rating is valuable in helping us better understand your
          <br />
          needs and tailor our service accordingly.
        </p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <input
          type="text"
          placeholder="Enter your name..."
          value={reviewForm.name}
          onChange={(e) =>
            setReviewForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <div className="rate-us">
          <p>Rate us</p>
        </div>
        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`${star}star ${
                selectedRating >= star ? "active" : ""
              }`}
              onClick={() => handleStarClick(star)}
              type="button"
            >
              <img src={review_star} alt={`${star} star rating`} />
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add a comment..."
          value={reviewForm.comment}
          onChange={(e) =>
            setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
          }
        />
        <button type="submit" onClick={handleSubmit}>
          Submit Now
        </button>
      </div>
      <div className="reviews-wrapper">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Review
              key={review._id}
              name={review.name}
              rating={review.rating}
              comment={review.comment}
            />
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </div>
    </>
  );
};

export default ReviewSection;
