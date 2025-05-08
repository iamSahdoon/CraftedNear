import galleryModel from "../models/galleryModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create gallery details API - /api/gallery/createGallery
const createGalleryDetails = async (req, res) => {
  try {
    const { sellerId, product_description, price } = req.body;
    let imageUrl = "";

    // If there's a file, upload to cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gallery_images",
      });
      imageUrl = result.secure_url;
    }

    const newGalleryItem = new galleryModel({
      sellerId,
      image: imageUrl,
      product_description,
      price,
    });

    const savedGalleryItem = await newGalleryItem.save();

    res.status(201).json({
      success: true,
      message: "Gallery item added successfully",
      savedGalleryItem,
    });
  } catch (error) {
    console.error("Create gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add gallery item",
      error: error.message,
    });
  }
};

// Get all gallery details API - /api/gallery/getAllGallery
const getAllGalleryDetails = async (req, res) => {
  try {
    const { sellerId } = req.query;
    let query = {};

    // If sellerId is provided, filter by seller
    if (sellerId) {
      query.sellerId = sellerId;
    }

    const galleryItems = await galleryModel
      .find(query)
      .populate("sellerId", "name store.name store.avatar")
      .sort({ uploadedDate: -1 });

    res.status(200).json({
      success: true,
      message: "Gallery items retrieved successfully",
      galleryItems,
    });
  } catch (error) {
    console.error("Get gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve gallery items",
      error: error.message,
    });
  }
};

// Update gallery details API - /api/gallery/updateGallery/:id
const updateGalleryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_description, price } = req.body;

    // 1. Fetch the existing gallery item
    const existingGalleryItem = await galleryModel.findById(id);
    if (!existingGalleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // 2. Initialize an empty object for updates
    const updateData = {};

    // 3. Handle Image Update (only if a new file is provided)
    let newImageUrl;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "gallery_images",
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
    if (price !== undefined) {
      // Ensure it's a number if provided as string
      const numericPrice = Number(price);
      if (!isNaN(numericPrice)) {
        // Check if conversion was successful
        updateData.price = numericPrice;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid price value provided.",
        });
      }
    }

    // 5. Perform the update only with the fields present in updateData
    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes provided, gallery item remains the same.",
        updatedGalleryItem: existingGalleryItem, // Return the existing item
      });
    }

    const updatedGalleryItem = await galleryModel.findByIdAndUpdate(
      id,
      updateData, // Use the conditionally built object
      { new: true } // Return the updated document
    );

    // This check might be redundant if the first fetch worked, but good practice
    if (!updatedGalleryItem) {
      return res.status(404).json({
        success: false,
        message:
          "Gallery item not found during update (should not happen if initial fetch succeeded)",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      updatedGalleryItem,
    });
  } catch (error) {
    console.error("Update gallery error:", error);
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
      message: "Failed to update gallery item",
      error: error.message,
    });
  }
};

// Delete gallery item API - /api/gallery/deleteGallery/:id
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGalleryItem = await galleryModel.findByIdAndDelete(id);

    if (!deletedGalleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
      error: error.message,
    });
  }
};

export {
  createGalleryDetails,
  getAllGalleryDetails,
  updateGalleryDetails,
  deleteGalleryItem,
};
