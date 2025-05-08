import express from "express";
import {
  getSellers,
  getSingleSeller,
  registerSeller,
  loginSeller,
  updateSellerStore,
  getSellersLeaderboard,
  updateProfileVisit,
} from "../controllers/sellerController.js";
import upload from "../middleware/multer.js";

const sellerRouter = express.Router();

sellerRouter.get("/getSellers", getSellers);
sellerRouter.get("/getSingleSeller/:id", getSingleSeller);
sellerRouter.post("/registerSeller", registerSeller);
sellerRouter.post("/loginSeller", loginSeller);
sellerRouter.put(
  "/updateStore/:id",
  upload.single("avatar"),
  updateSellerStore
);
sellerRouter.get("/getSellersLeaderboard", getSellersLeaderboard);
sellerRouter.put("/updateProfileVisit/:id", updateProfileVisit);

export default sellerRouter;
