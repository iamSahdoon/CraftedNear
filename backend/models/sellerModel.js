import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    tel: { type: String, required: true },
    store_category: { type: String, required: true },
    profile_visit: { type: Number, default: 0 },
    store: {
      name: { type: String, default: "" },
      avatar: { type: String, default: "" },
      store_description: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const sellerModel =
  mongoose.models.seller || mongoose.model("seller", sellerSchema);
export default sellerModel;
