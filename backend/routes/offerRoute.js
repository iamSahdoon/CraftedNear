import express from "express";
import {
  createOffer,
  getAllOffers,
  getAllOffersFromSellers,
  updateOffer,
  deleteOffer,
} from "../controllers/offerController.js";
import upload from "../middleware/multer.js";

const offerRouter = express.Router();

offerRouter.post("/createOffer", upload.single("image"), createOffer);
offerRouter.get("/getAllOffers", getAllOffers);
offerRouter.get("/getAllOffersFromSellers", getAllOffersFromSellers);
offerRouter.put("/updateOffer/:id", upload.single("image"), updateOffer);
offerRouter.delete("/deleteOffer/:id", deleteOffer);

export default offerRouter;
