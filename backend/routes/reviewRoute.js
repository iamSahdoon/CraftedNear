import express from "express";
import {
  createReview,
  getAllReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/createReview", createReview);
reviewRouter.get("/getAllReviews", getAllReviews);

export default reviewRouter;
