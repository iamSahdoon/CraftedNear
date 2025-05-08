import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
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
    old_price: {
      type: Number,
      required: true,
    },
    new_price: {
      type: Number,
      required: true,
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

const offerModel =
  mongoose.models.offer || mongoose.model("offer", offerSchema);
export default offerModel;
