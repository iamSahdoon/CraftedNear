import sellerModel from "../models/sellerModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// get all sellers API - /api/sellers/getSellers
const getSellers = async (req, res) => {
  try {
    const getAllSellers = await sellerModel.find({});
    res.status(200).json({
      message: "get all sellers API working",
      getAllSellers,
    });
  } catch (error) {
    res.status(500).json({
      message: "get all sellers API error",
      error,
    });
  }
};

// get single seller API - /api/sellers/getSingleSeller/:id
const getSingleSeller = async (req, res) => {
  try {
    const getSingleSeller = await sellerModel.findById(req.params.id);
    res.status(200).json({
      message: "get single seller API working",
      getSingleSeller,
    });
  } catch (error) {
    res.status(500).json({
      message: "get single seller API error",
      error,
    });
  }
};

// register seller API - /api/sellers/registerSeller
const registerSeller = async (req, res) => {
  try {
    const { name, email, password, city, location, tel, store_category } =
      req.body;

    // check if seller already exists
    const sellerExists = await sellerModel.findOne({ email });
    if (sellerExists) {
      return res.status(400).json({
        success: false,
        message: "Seller already exists",
      });
    }

    // validating email format & strong password length
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const newSeller = new sellerModel({
      name,
      email,
      password,
      city,
      location,
      tel,
      store_category,
    });
    const savedSeller = await newSeller.save();
    const token = createToken(savedSeller._id);

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      savedSeller,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Seller registration failed",
      error,
    });
  }
};

// login seller API - /api/sellers/loginSeller
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if seller exists
    const sellerExists = await sellerModel.findOne({ email });
    if (!sellerExists) {
      return res.status(400).json({
        success: false,
        message: "Seller does not exist",
      });
    }

    // check if password is correct
    if (password !== sellerExists.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = createToken(sellerExists._id);
    res.status(200).json({
      success: true,
      message: "Seller logged in successfully",
      sellerExists,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Seller login failed",
      error,
    });
  }
};

// update seller store details API - /api/sellers/updateStore/:id
const updateSellerStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, store_description } = req.body; // Field names from request body

    // 1. Fetch the existing seller
    const existingSeller = await sellerModel.findById(id);
    if (!existingSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // 2. Initialize an empty object for updates using dot notation for nested fields
    const updateData = {};

    // 3. Handle Avatar Update (only if a new file is provided)
    let newAvatarUrl;
    if (req.file) {
      // Multer uses 'avatar' field name from the route
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "seller_store_images", // Use appropriate folder
        });
        newAvatarUrl = result.secure_url;
        updateData["store.avatar"] = newAvatarUrl; // Use dot notation for nested field
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload new store avatar",
          error: uploadError.message,
        });
      }
    }
    // If req.file is not present, store.avatar remains unset in updateData

    // 4. Conditionally add other fields if provided
    if (name !== undefined) {
      updateData["store.name"] = name; // Use dot notation
    }
    if (store_description !== undefined) {
      updateData["store.store_description"] = store_description; // Use dot notation
    }

    // 5. Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes provided, store details remain the same.",
        updatedSeller: existingSeller, // Return the existing seller data
      });
    }

    // 6. Perform the update
    const updatedSeller = await sellerModel.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to apply updates with dot notation
      { new: true, runValidators: true } // Return updated doc, run schema validation
    );

    if (!updatedSeller) {
      // Should ideally not happen if initial fetch worked
      return res.status(404).json({
        success: false,
        message: "Seller not found during update.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Store details updated successfully",
      updatedSeller, // Send back the whole updated seller document
    });
  } catch (error) {
    console.error("Update store error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update store details",
      error: error.message,
    });
  }
};

// get sellers leaderboard API - /api/sellers/getSellersLeaderboard
const getSellersLeaderboard = async (req, res) => {
  try {
    const sellersLeaderboard = await sellerModel
      .find({}, "name city profile_visit store.name") // Only select these fields
      .sort({ profile_visit: -1 }) // Sort by profile_visit in descending order
      .limit(10); // Limit to top 10 sellers

    // Format the response
    const formattedLeaderboard = sellersLeaderboard.map((seller, index) => ({
      rank: index + 1,
      name: seller.store.name || seller.name, // Use store name if available, fallback to seller name
      city: seller.city,
      profile_visit: seller.profile_visit,
    }));

    res.status(200).json({
      success: true,
      message: "Sellers leaderboard retrieved successfully",
      leaderboard: formattedLeaderboard,
    });
  } catch (error) {
    console.error("Get sellers leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve sellers leaderboard",
      error: error.message,
    });
  }
};

// Update seller profile visit API - /api/sellers/updateProfileVisit/:id
const updateProfileVisit = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const updatedSeller = await sellerModel.findByIdAndUpdate(
      sellerId,
      { $inc: { profile_visit: 1 } }, // Increment profile_visit by 1
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile visit count updated successfully",
      updatedSeller,
    });
  } catch (error) {
    console.error("Update profile visit error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile visit count",
      error: error.message,
    });
  }
};

export {
  getSellers,
  getSingleSeller,
  registerSeller,
  loginSeller,
  updateSellerStore,
  getSellersLeaderboard,
  updateProfileVisit,
};
