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
connectDB().catch(() => {}); // start connecting right away; requests await it below
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// Wait for the database before handling a request, and say so plainly when it
// is unreachable instead of letting every query time out after 10s
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database unavailable",
      error: `${error.name}: ${error.message}`,
    });
  }
});

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

app.listen(port, () => {
  console.log(`Server running on : port ${port}`);
});
