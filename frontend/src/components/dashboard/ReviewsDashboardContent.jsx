import { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import Review from "../stores/Review"; // Reuse the existing Review component
import "./ReviewsDashboardContent.css"; // We'll create this CSS file

const ReviewsDashboardContent = () => {
  const { seller, reviews, fetchReviews } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0); // State for average rating

  useEffect(() => {
    const loadReviews = async () => {
      if (seller?._id) {
        setIsLoading(true);
        try {
          // fetchReviews now returns the data including averageRating
          const data = await fetchReviews(seller._id);
          if (data && data.averageRating !== undefined) {
            setAverageRating(data.averageRating);
          } else {
            setAverageRating(0); // Reset if no data or averageRating
          }
        } catch (error) {
          console.error("Error loading reviews in dashboard:", error);
          setAverageRating(0);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAverageRating(0); // Reset if no seller
      }
    };
    loadReviews();
  }, [seller, fetchReviews]);

  return (
    <div className="reviews-dashboard-content">
      {isLoading ? (
        <p>Loading reviews...</p>
      ) : (
        <>
          {reviews && reviews.length > 0 && (
            <div className="average-rating-display">
              Average Rating: <span>{averageRating} / 5</span>
            </div>
          )}
          <div className="reviews-grid">
            {" "}
            {/* Changed class for dashboard layout */}
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
              <p>You have not received any reviews yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsDashboardContent;
