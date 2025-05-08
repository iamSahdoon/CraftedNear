import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    uploadedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const galleryModel =
  mongoose.models.gallery || mongoose.model("gallery", gallerySchema);
export default galleryModel;
