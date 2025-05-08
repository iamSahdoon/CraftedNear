import reviewModel from "../models/reviewModel.js";

// Create review API - /api/reviews/createReview
const createReview = async (req, res) => {
  try {
    const { sellerId, name, rating, comment } = req.body;

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const newReview = new reviewModel({
      sellerId,
      name,
      rating,
      comment,
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      savedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// Get all reviews API - /api/reviews/getAllReviews
const getAllReviews = async (req, res) => {
  try {
    const { sellerId } = req.query;
    let query = {};

    // If sellerId is provided, filter by seller
    if (sellerId) {
      query.sellerId = sellerId;
    }

    const reviews = await reviewModel
      .find(query)
      .populate("sellerId", "name store.name")
      .sort({ reviewDate: -1 }); // Sort by newest first

    // Calculate average rating if sellerId is provided
    let averageRating = 0;
    if (sellerId && reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = (totalRating / reviews.length).toFixed(1);
    }

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews,
      averageRating: sellerId ? averageRating : undefined,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews",
      error: error.message,
    });
  }
};

export { createReview, getAllReviews };
