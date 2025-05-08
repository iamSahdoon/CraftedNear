import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Customer API calls
export const customerAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post("/api/customers/loginCustomer", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addFavoriteStore: async (customerId, storeData) => {
    try {
      const response = await api.post(
        `/api/customers/addFavoriteStore/${customerId}`,
        storeData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getFavoriteStores: async (customerId) => {
    try {
      const response = await api.get(
        `/api/customers/getFavoriteStores/${customerId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (customerData) => {
    try {
      const response = await api.post(
        "/api/customers/registerCustomer",
        customerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePoints: async (customerId, points) => {
    try {
      const response = await api.put(
        `/api/customers/updatePoints/${customerId}`,
        {
          points,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ADD FUNCTION to get customer leaderboard
  getCustomersLeaderboard: async () => {
    try {
      const response = await api.get("/api/customers/getCustomersLeaderboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await api.put(
        `/api/customers/updateCustomer/${customerId}`,
        customerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removeFavoriteStore: async (customerId, sellerId) => {
    try {
      const response = await api.delete(
        `/api/customers/removeFavoriteStore/${customerId}`,
        {
          data: { sellerId },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add other customer-related API calls here
};

// Seller API calls
export const sellerAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post("/api/sellers/loginSeller", {
        email,
        password,
      });
      console.log("Seller login response:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllSellers: async () => {
    try {
      const response = await api.get("/api/sellers/getSellers");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSellersLeaderboard: async () => {
    try {
      const response = await api.get("/api/sellers/getSellersLeaderboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (sellerData) => {
    try {
      const response = await api.post(
        "/api/sellers/registerSeller",
        sellerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfileVisit: async (sellerId) => {
    try {
      const response = await api.put(
        `/api/sellers/updateProfileVisit/${sellerId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ADD updateStore function
  updateStore: async (sellerId, storeData) => {
    try {
      // Note: The backend route uses 'avatar' for the file field name
      const response = await api.put(
        `/api/sellers/updateStore/${sellerId}`,
        storeData, // Send FormData
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add other seller-related API calls here
};

// Gallery API calls
export const galleryAPI = {
  getAllGallery: async (sellerId) => {
    try {
      console.log("Making API call to get gallery items for seller:", sellerId);
      const response = await api.get(
        `/api/gallery/getAllGallery?sellerId=${sellerId}`
      );
      console.log("Gallery API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Gallery API error:", error);
      throw error.response?.data || error.message;
    }
  },

  createGallery: async (galleryData) => {
    try {
      const response = await api.post(
        "/api/gallery/createGallery",
        galleryData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateGallery: async (galleryId, galleryData) => {
    try {
      const response = await api.put(
        `/api/gallery/updateGallery/${galleryId}`,
        galleryData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteGallery: async (galleryId) => {
    try {
      const response = await api.delete(
        `/api/gallery/deleteGallery/${galleryId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Review API calls
export const reviewAPI = {
  createReview: async (reviewData) => {
    try {
      const response = await api.post("/api/reviews/createReview", reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllReviews: async (sellerId) => {
    try {
      const response = await api.get(
        `/api/reviews/getAllReviews?sellerId=${sellerId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Offer API calls
export const offerAPI = {
  getAllOffers: async (sellerId) => {
    try {
      const response = await api.get(
        `/api/offers/getAllOffers${sellerId ? `?sellerId=${sellerId}` : ""}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllOffersFromSellers: async () => {
    try {
      const response = await api.get("/api/offers/getAllOffersFromSellers");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createOffer: async (offerData) => {
    try {
      const response = await api.post("/api/offers/createOffer", offerData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOffer: async (offerId, offerData) => {
    try {
      const response = await api.put(
        `/api/offers/updateOffer/${offerId}`,
        offerData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteOffer: async (offerId) => {
    try {
      const response = await api.delete(`/api/offers/deleteOffer/${offerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Exclusive Offer API calls
export const exclusiveOfferAPI = {
  getAllExclusiveOffers: async (sellerId) => {
    try {
      const response = await api.get(
        `/api/exclusive-offers/getAllExclusiveOffers${
          sellerId ? `?sellerId=${sellerId}` : ""
        }`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createExclusiveOffer: async (offerData) => {
    try {
      const response = await api.post(
        "/api/exclusive-offers/createExclusiveOffer",
        offerData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateExclusiveOffer: async (offerId, offerData) => {
    try {
      const response = await api.put(
        `/api/exclusive-offers/updateExclusiveOffer/${offerId}`,
        offerData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteExclusiveOffer: async (offerId) => {
    try {
      const response = await api.delete(
        `/api/exclusive-offers/deleteExclusiveOffer/${offerId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Updated interceptor to check for both types of tokens
//automatically add the token to the request headers
api.interceptors.request.use(
  (config) => {
    // Check if it's a seller-related endpoint
    if (config.url.includes("/sellers")) {
      const sellerToken = localStorage.getItem("sellerToken");
      if (sellerToken) {
        config.headers.Authorization = `Bearer ${sellerToken}`;
      }
    }
    // Check if it's a customer-related endpoint
    else if (config.url.includes("/customers")) {
      const customerToken = localStorage.getItem("customerToken");
      if (customerToken) {
        config.headers.Authorization = `Bearer ${customerToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
