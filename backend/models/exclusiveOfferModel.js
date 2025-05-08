import mongoose from "mongoose";

const exclusiveOfferSchema = new mongoose.Schema(
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
    customer_point_threshold: {
      type: String,
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

const exclusiveOfferModel =
  mongoose.models.exclusiveOffer ||
  mongoose.model("exclusiveOffer", exclusiveOfferSchema);
export default exclusiveOfferModel;
