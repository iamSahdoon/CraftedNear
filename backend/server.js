import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/connectDatabase.js";
import customerRouter from "./routes/customerRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import sellerRouter from "./routes/sellerRoute.js";
import galleryRouter from "./routes/galleryRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import offerRouter from "./routes/offerRoute.js";
import exclusiveOfferRouter from "./routes/exclusiveOfferRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/customers", customerRouter);
app.use("/api/sellers", sellerRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/offers", offerRouter);
app.use("/api/exclusive-offers", exclusiveOfferRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, (req, res) => {
  console.log(`Server running on : port ${port}`);
});
