import express from "express";
import {
  createGalleryDetails,
  getAllGalleryDetails,
  updateGalleryDetails,
  deleteGalleryItem,
} from "../controllers/galleryController.js";
import upload from "../middleware/multer.js";

const galleryRouter = express.Router();

galleryRouter.post(
  "/createGallery",
  upload.single("image"),
  createGalleryDetails
);
galleryRouter.get("/getAllGallery", getAllGalleryDetails);
galleryRouter.put(
  "/updateGallery/:id",
  upload.single("image"),
  updateGalleryDetails
);
galleryRouter.delete("/deleteGallery/:id", deleteGalleryItem);

export default galleryRouter;
