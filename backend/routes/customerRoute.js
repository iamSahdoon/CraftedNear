import express from "express";
import {
  getCustomers,
  getSingleCustomer,
  registerCustomer,
  loginCustomer,
  addFavoriteStore,
  removeFavoriteStore,
  getFavoriteStores,
  updatePoints,
  getCustomersLeaderboard,
  updateCustomer,
} from "../controllers/customerController.js";

const customerRouter = express.Router();

customerRouter.get("/getCustomers", getCustomers);
customerRouter.get("/getSingleCustomer/:id", getSingleCustomer);
customerRouter.post("/registerCustomer", registerCustomer);
customerRouter.post("/loginCustomer", loginCustomer);
customerRouter.post("/addFavoriteStore/:id", addFavoriteStore);
customerRouter.delete("/removeFavoriteStore/:id", removeFavoriteStore);
customerRouter.get("/getFavoriteStores/:id", getFavoriteStores);
customerRouter.put("/updatePoints/:id", updatePoints);
customerRouter.get("/getCustomersLeaderboard", getCustomersLeaderboard);
customerRouter.put("/updateCustomer/:id", updateCustomer);

export default customerRouter;
