import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    batch: {
      type: [String],
      default: ["Iron"],
    },
    title: {
      type: String,
      default: "newbie",
    },
    store_fav: [
      {
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "seller",
        },
        storeName: {
          type: String,
          default: "",
        },
        storeAvatar: {
          type: String,
          default: "",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const customerModel =
  mongoose.models.customer || mongoose.model("customer", customerSchema);
export default customerModel;
