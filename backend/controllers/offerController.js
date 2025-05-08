import offerModel from "../models/offerModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create offer API - /api/offers/createOffer
const createOffer = async (req, res) => {
  try {
    const { sellerId, product_description, old_price, new_price } = req.body;
    let imageUrl = "";

    // Validate prices
    if (new_price >= old_price) {
      return res.status(400).json({
        success: false,
        message: "New price must be less than old price",
      });
    }

    // If there's a file, upload to cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "offer_images",
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const newOffer = new offerModel({
      sellerId,
      image: imageUrl,
      product_description,
      old_price,
      new_price,
    });

    const savedOffer = await newOffer.save();

    res.status(201).json({
      success: true,
      message: "Offer added successfully",
      savedOffer,
    });
  } catch (error) {
    console.error("Create offer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add offer",
      error: error.message,
    });
  }
};

// Get all offers API - /api/offers/getAllOffers
const getAllOffers = async (req, res) => {
  try {
    const { sellerId } = req.query;
    let query = {};

    // If sellerId is provided, filter by seller
    if (sellerId) {
      query.sellerId = sellerId;
    }

    const offers = await offerModel
      .find(query)
      .populate("sellerId", "name store.name store.avatar")
      .sort({ uploadedDate: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      message: "Offers retrieved successfully",
      offers,
      totalOffers: offers.length,
    });
  } catch (error) {
    console.error("Get offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve offers",
      error: error.message,
    });
  }
};

// Get all offers from all sellers API - /api/offers/getAllOffersFromSellers
const getAllOffersFromSellers = async (req, res) => {
  try {
    const allOffers = await offerModel
      .find()
      .populate({
        path: "sellerId",
        select:
          "name email tel store.name store.avatar store.store_description city location store_category",
      })
      .sort({ uploadedDate: -1 }); // Sort by newest first

    // Format the response to include seller details with each offer
    const formattedOffers = allOffers.map((offer) => ({
      _id: offer._id,
      image: offer.image,
      product_description: offer.product_description,
      old_price: offer.old_price,
      new_price: offer.new_price,
      uploadedDate: offer.uploadedDate,
      seller: {
        _id: offer.sellerId._id,
        name: offer.sellerId.name,
        email: offer.sellerId.email,
        tel: offer.sellerId.tel,
        storeName: offer.sellerId.store.name,
        storeAvatar: offer.sellerId.store.avatar,
        storeDescription: offer.sellerId.store.store_description,
        city: offer.sellerId.city,
        location: offer.sellerId.location,
        store_category: offer.sellerId.store_category,
      },
    }));

    res.status(200).json({
      success: true,
      message: "All offers from all sellers retrieved successfully",
      offers: formattedOffers,
      totalOffers: formattedOffers.length,
    });
  } catch (error) {
    console.error("Get all offers from sellers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve offers from sellers",
      error: error.message,
    });
  }
};

// Update offer API - /api/offers/updateOffer/:id
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_description, old_price, new_price } = req.body;

    // 1. Fetch the existing offer
    const existingOffer = await offerModel.findById(id);
    if (!existingOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // 2. Initialize an empty object for updates
    const updateData = {};

    // 3. Handle Image Update (only if a new file is provided)
    let newImageUrl;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "offer_images",
        });
        newImageUrl = result.secure_url;
        updateData.image = newImageUrl; // Add image to updateData only if new file exists
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload new image",
          error: uploadError.message,
        });
      }
    }
    // If req.file is not present, updateData.image remains unset, preserving the existing DB value.

    // 4. Conditionally add other fields to updateData if they are provided
    if (product_description !== undefined) {
      updateData.product_description = product_description;
    }
    if (old_price !== undefined) {
      // Ensure it's a number if provided as string
      updateData.old_price = Number(old_price);
    }
    if (new_price !== undefined) {
      // Ensure it's a number if provided as string
      updateData.new_price = Number(new_price);
    }

    // 5. Perform Price Validation (using potentially updated values or existing ones)
    const finalOldPrice =
      updateData.old_price !== undefined
        ? updateData.old_price
        : existingOffer.old_price;
    const finalNewPrice =
      updateData.new_price !== undefined
        ? updateData.new_price
        : existingOffer.new_price;

    // Check only if at least one price is being set/updated
    if (
      (updateData.old_price !== undefined ||
        updateData.new_price !== undefined) &&
      finalNewPrice >= finalOldPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "New price must be less than old price",
      });
    }

    // 6. Perform the update only with the fields present in updateData
    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes provided, offer remains the same.",
        updatedOffer: existingOffer, // Return the existing offer
      });
    }

    const updatedOffer = await offerModel.findByIdAndUpdate(
      id,
      updateData, // Use the conditionally built object
      { new: true } // Return the updated document
    );

    // This check might be redundant if the first fetch worked, but good practice
    if (!updatedOffer) {
      return res.status(404).json({
        success: false,
        message:
          "Offer not found during update (should not happen if initial fetch succeeded)",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      updatedOffer,
    });
  } catch (error) {
    console.error("Update offer error:", error);
    // Check for specific Mongoose validation errors if needed
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update offer",
      error: error.message,
    });
  }
};

// Delete offer API - /api/offers/deleteOffer/:id
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOffer = await offerModel.findByIdAndDelete(id);

    if (!deletedOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.error("Delete offer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete offer",
      error: error.message,
    });
  }
};

export {
  createOffer,
  getAllOffers,
  getAllOffersFromSellers,
  updateOffer,
  deleteOffer,
};
