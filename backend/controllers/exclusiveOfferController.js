import exclusiveOfferModel from "../models/exclusiveOfferModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create exclusive offer API - /api/exclusive-offers/createExclusiveOffer
const createExclusiveOffer = async (req, res) => {
  try {
    const {
      sellerId,
      product_description,
      old_price,
      new_price,
      customer_point_threshold,
    } = req.body;

    let imageUrl = "";

    // If there's a file, upload to cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "exclusive_offer_images",
      });
      imageUrl = result.secure_url;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const newExclusiveOffer = new exclusiveOfferModel({
      sellerId,
      image: imageUrl,
      product_description,
      old_price,
      new_price,
      customer_point_threshold,
    });

    const savedExclusiveOffer = await newExclusiveOffer.save();

    res.status(201).json({
      success: true,
      message: "Exclusive offer created successfully",
      offer: savedExclusiveOffer,
    });
  } catch (error) {
    console.error("Create exclusive offer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create exclusive offer",
      error: error.message,
    });
  }
};

// Get all exclusive offers API - /api/exclusive-offers/getAllExclusiveOffers
const getAllExclusiveOffers = async (req, res) => {
  try {
    const { sellerId } = req.query;
    let query = {};

    // If sellerId is provided, filter by seller
    if (sellerId) {
      query.sellerId = sellerId;
    }

    // Fetch offers and populate seller details
    const exclusiveOffers = await exclusiveOfferModel
      .find(query)
      .populate({
        path: "sellerId",
        select: "name email city location store_category store",
        model: "seller",
      })
      .sort({ uploadedDate: -1 }); // Sort by newest first

    // Format the response
    const formattedOffers = exclusiveOffers.map((offer) => ({
      _id: offer._id,
      image: offer.image,
      product_description: offer.product_description,
      old_price: offer.old_price,
      new_price: offer.new_price,
      customer_point_threshold: offer.customer_point_threshold,
      uploadedDate: offer.uploadedDate,
      seller: {
        _id: offer.sellerId._id,
        name: offer.sellerId.name,
        email: offer.sellerId.email,
        city: offer.sellerId.city,
        location: offer.sellerId.location,
        store_category: offer.sellerId.store_category,
        storeName: offer.sellerId.store.name,
        storeAvatar: offer.sellerId.store.avatar,
        storeDescription: offer.sellerId.store.store_description,
      },
    }));

    res.status(200).json({
      success: true,
      message: "Exclusive offers retrieved successfully",
      offers: formattedOffers,
    });
  } catch (error) {
    console.error("Get exclusive offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve exclusive offers",
      error: error.message,
    });
  }
};

// Update exclusive offer API - /api/exclusive-offers/updateExclusiveOffer/:id
const updateExclusiveOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_description,
      old_price,
      new_price,
      customer_point_threshold,
    } = req.body;

    // 1. Fetch the existing offer
    const existingOffer = await exclusiveOfferModel.findById(id);
    if (!existingOffer) {
      return res.status(404).json({
        success: false,
        message: "Exclusive offer not found",
      });
    }

    // 2. Initialize an empty object for updates
    const updateData = {};

    // 3. Handle Image Update (only if a new file is provided)
    let newImageUrl;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "exclusive_offer_images", // Correct folder
        });
        newImageUrl = result.secure_url;
        updateData.image = newImageUrl;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload new image",
          error: uploadError.message,
        });
      }
    }

    // 4. Conditionally add other fields to updateData
    if (product_description !== undefined) {
      updateData.product_description = product_description;
    }
    if (old_price !== undefined) {
      updateData.old_price = Number(old_price);
    }
    if (new_price !== undefined) {
      updateData.new_price = Number(new_price);
    }
    if (customer_point_threshold !== undefined) {
      updateData.customer_point_threshold = customer_point_threshold;
    }

    // 5. Perform Price Validation
    const finalOldPrice =
      updateData.old_price !== undefined
        ? updateData.old_price
        : existingOffer.old_price;
    const finalNewPrice =
      updateData.new_price !== undefined
        ? updateData.new_price
        : existingOffer.new_price;

    if (
      (updateData.old_price !== undefined ||
        updateData.new_price !== undefined) &&
      finalNewPrice >= finalOldPrice // Allow new_price == old_price if only one is set? Assuming new < old required if both changing
    ) {
      // Add specific check if only one price is provided if needed
      // Currently requires new_price < old_price if either is updated. Adjust if business logic differs.
      return res.status(400).json({
        success: false,
        message: "New price must generally be less than old price for offers",
      });
    }

    // 6. Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes provided, exclusive offer remains the same.",
        offer: existingOffer,
      });
    }

    // 7. Perform the update
    const updatedOffer = await exclusiveOfferModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // runValidators ensures schema rules are checked on update
    );

    if (!updatedOffer) {
      // Should ideally not be reached if initial fetch succeeded, but good safeguard
      return res.status(404).json({
        success: false,
        message: "Exclusive offer not found during update attempt.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exclusive offer updated successfully",
      offer: updatedOffer,
    });
  } catch (error) {
    console.error("Update exclusive offer error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update exclusive offer",
      error: error.message,
    });
  }
};

// Delete exclusive offer API - /api/exclusive-offers/deleteExclusiveOffer/:id
const deleteExclusiveOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOffer = await exclusiveOfferModel.findByIdAndDelete(id);

    if (!deletedOffer) {
      return res.status(404).json({
        success: false,
        message: "Exclusive offer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exclusive offer deleted successfully",
    });
  } catch (error) {
    console.error("Delete exclusive offer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete exclusive offer",
      error: error.message,
    });
  }
};

export {
  createExclusiveOffer,
  getAllExclusiveOffers,
  updateExclusiveOffer,
  deleteExclusiveOffer,
};
