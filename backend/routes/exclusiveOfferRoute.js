import express from "express";
import {
  createExclusiveOffer,
  getAllExclusiveOffers,
  updateExclusiveOffer,
  deleteExclusiveOffer,
} from "../controllers/exclusiveOfferController.js";
import upload from "../middleware/multer.js";

const exclusiveOfferRouter = express.Router();

exclusiveOfferRouter.post(
  "/createExclusiveOffer",
  upload.single("image"),
  createExclusiveOffer
);
exclusiveOfferRouter.get("/getAllExclusiveOffers", getAllExclusiveOffers);

exclusiveOfferRouter.put(
  "/updateExclusiveOffer/:id",
  upload.single("image"),
  updateExclusiveOffer
);

exclusiveOfferRouter.delete("/deleteExclusiveOffer/:id", deleteExclusiveOffer);

export default exclusiveOfferRouter;
