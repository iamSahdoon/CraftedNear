import customerModel from "../models/customerModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// get all customers API - /api/customers/getCustomers
const getCustomers = async (req, res) => {
  try {
    const getAllCustomers = await customerModel.find({});
    res.status(200).json({
      message: "get all customers API working",
      getAllCustomers,
    });
  } catch (error) {
    res.status(500).json({
      message: "get all customers API error",
      error,
    });
  }
};

// get single customer API - /api/customers/getSingleCustomer/:id
const getSingleCustomer = async (req, res) => {
  try {
    const getSingleCustomer = await customerModel.findById(req.params.id);
    res.status(200).json({
      message: "get single customer API working",
      getSingleCustomer,
    });
  } catch (error) {
    res.status(500).json({
      message: "get single customer API error",
      error,
    });
  }
};

// register customer API - /api/customers/registerCustomer
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    //check if customer already exists
    const customerExists = await customerModel.findOne({ email });
    if (customerExists) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists",
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

    const newCustomer = new customerModel({
      name,
      email,
      password,
      location,
    });
    const savedCustomer = await newCustomer.save();
    const token = createToken(savedCustomer._id);

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      savedCustomer,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Customer registration failed",
      error,
    });
  }
};

// login customer API - /api/customers/loginCustomer
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if customer exists
    const customerExists = await customerModel.findOne({ email });
    if (!customerExists) {
      return res.status(400).json({
        success: false,
        message: "Customer does not exist",
      });
    }
    // check if password is correct
    if (password !== customerExists.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    // create token
    const token = createToken(customerExists._id);
    res.status(200).json({
      success: true,
      message: "Customer logged in successfully",
      customerExists,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Customer login failed",
      error,
    });
  }
};

// Add store to favorites API - /api/customers/addFavoriteStore/:id
const addFavoriteStore = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { sellerId, storeName, storeAvatar } = req.body;

    // Check if store is already in favorites
    const customer = await customerModel.findById(customerId);
    const isAlreadyFavorite = customer.store_fav.some(
      (store) => store.sellerId.toString() === sellerId
    );

    if (isAlreadyFavorite) {
      return res.status(400).json({
        success: false,
        message: "Store is already in favorites",
      });
    }

    // Add to favorites
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      customerId,
      {
        $push: {
          store_fav: {
            sellerId,
            storeName,
            storeAvatar,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Store added to favorites successfully",
      updatedCustomer,
    });
  } catch (error) {
    console.error("Add favorite store error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add store to favorites",
      error: error.message,
    });
  }
};

// Remove store from favorites API - /api/customers/removeFavoriteStore/:id
const removeFavoriteStore = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { sellerId } = req.body;

    const updatedCustomer = await customerModel.findByIdAndUpdate(
      customerId,
      {
        $pull: {
          store_fav: {
            sellerId,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Store removed from favorites successfully",
      updatedCustomer,
    });
  } catch (error) {
    console.error("Remove favorite store error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove store from favorites",
      error: error.message,
    });
  }
};

// Get favorite stores API - /api/customers/getFavoriteStores/:id
const getFavoriteStores = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await customerModel
      .findById(customerId)
      .select("store_fav")
      .sort({ "store_fav.addedAt": -1 });

    res.status(200).json({
      success: true,
      message: "Favorite stores retrieved successfully",
      favoriteStores: customer.store_fav,
    });
  } catch (error) {
    console.error("Get favorite stores error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve favorite stores",
      error: error.message,
    });
  }
};

// Update customer points API - /api/customers/updatePoints/:id
const updatePoints = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { points } = req.body;

    const updatedCustomer = await customerModel.findByIdAndUpdate(
      customerId,
      { $inc: { points: points } }, // Increment points by the given amount
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Points updated successfully",
      updatedCustomer,
    });
  } catch (error) {
    console.error("Update points error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update points",
      error: error.message,
    });
  }
};

// Get customers leaderboard API - /api/customers/getCustomersLeaderboard
const getCustomersLeaderboard = async (req, res) => {
  try {
    // Fetch customers, sort by points descending, limit if needed (e.g., top 10)
    const leaderboard = await customerModel
      .find({}, "name location points") // Select only needed fields
      .sort({ points: -1 }) // Sort by points, highest first
      .limit(20); // Example: Limit to top 20

    res.status(200).json({
      success: true,
      message: "Customers leaderboard retrieved successfully",
      leaderboard,
    });
  } catch (error) {
    console.error("Get customers leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers leaderboard",
      error: error.message,
    });
  }
};

// Update customer API - /api/customers/updateCustomer/:id
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, location, password } = req.body;

    // 1. Fetch the existing customer
    const existingCustomer = await customerModel.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // 2. Initialize an empty object for updates
    const updateData = {};

    // 3. Conditionally add fields to updateData if they are provided
    if (name !== undefined) {
      updateData.name = name;
    }

    if (location !== undefined) {
      updateData.location = location;
    }

    if (email !== undefined) {
      // Validate email format if provided
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email",
        });
      }

      // Check if email is already in use by another customer
      if (email !== existingCustomer.email) {
        const emailExists = await customerModel.findOne({ email });
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Email is already in use",
          });
        }
      }

      updateData.email = email;
    }

    if (password !== undefined) {
      // Validate password length if provided
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }

      updateData.password = password;
    }

    // 4. Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes provided, customer remains the same.",
        updatedCustomer: existingCustomer,
      });
    }

    // 5. Perform the update
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // 6. Check if update succeeded
    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found during update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      updatedCustomer,
    });
  } catch (error) {
    console.error("Update customer error:", error);
    // Check for specific Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

export {
  getCustomers,
  getSingleCustomer,
  registerCustomer,
  loginCustomer,
  addFavoriteStore,
  removeFavoriteStore,
  getFavoriteStores,
  updatePoints,
  getCustomersLeaderboard,
  updateCustomer,
};
