import { StoreContext } from "./StoreContext"; // Import from the correct file
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import {
  customerAPI,
  sellerAPI,
  galleryAPI,
  reviewAPI,
  offerAPI,
  exclusiveOfferAPI,
} from "../services/api";

const StoreContextProvider = (props) => {
  const [customer, setCustomer] = useState(null);
  const [seller, setSeller] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [allSellerOffers, setAllSellerOffers] = useState([]);
  const [sellersLeaderboard, setSellersLeaderboard] = useState([]);
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [exclusiveOffers, setExclusiveOffers] = useState([]);
  const [customersLeaderboard, setCustomersLeaderboard] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Check local storage when app loads
  useEffect(() => {
    // Check for customer session
    const storedCustomer = localStorage.getItem("customer");
    const customerToken = localStorage.getItem("customerToken");

    if (storedCustomer && customerToken) {
      try {
        setCustomer(JSON.parse(storedCustomer));
      } catch (error) {
        console.error("Error parsing stored customer data:", error);
        localStorage.removeItem("customer");
        localStorage.removeItem("customerToken");
      }
    }

    // Check for seller session
    const storedSeller = localStorage.getItem("seller");
    const sellerToken = localStorage.getItem("token");

    console.log("Checking seller session:", { storedSeller, sellerToken });

    if (storedSeller && sellerToken) {
      try {
        const parsedSeller = JSON.parse(storedSeller);
        console.log("Parsed seller data:", parsedSeller);
        setSeller(parsedSeller);
      } catch (error) {
        console.error("Error parsing stored seller data:", error);
        localStorage.removeItem("seller");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Customer login function
  const loginCustomer = async (email, password) => {
    try {
      const data = await customerAPI.login(email, password);

      if (data.success) {
        // Set customer state first
        setCustomer(data.customerExists);
        localStorage.setItem("customer", JSON.stringify(data.customerExists));
        localStorage.setItem("customerToken", data.token);

        // After setting the customer state, update points
        // This ensures we have a customer ID available
        // We use a small timeout to ensure the state is set first
        setTimeout(() => {
          if (data.customerExists._id) {
            customerAPI
              .updatePoints(data.customerExists._id, 20)
              .then((response) => {
                if (response.success) {
                  const newBatches = calculateBatches(
                    response.updatedCustomer.points
                  );
                  const newTitle = calculateTitle(
                    response.updatedCustomer.points
                  );
                  const updatedCustomer = {
                    ...data.customerExists,
                    points: response.updatedCustomer.points,
                    batch: newBatches,
                    title: newTitle,
                  };
                  setCustomer(updatedCustomer);
                  localStorage.setItem(
                    "customer",
                    JSON.stringify(updatedCustomer)
                  );
                }
              })
              .catch((err) =>
                console.error("Error updating login points:", err)
              );
          }
        }, 100);

        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "Login failed" };
    }
  };

  // Seller login function with debugging
  const loginSeller = async (email, password) => {
    try {
      const data = await sellerAPI.login(email, password);
      console.log("Login response:", data);

      if (data.success) {
        setSeller(data.sellerExists);
        localStorage.setItem("seller", JSON.stringify(data.sellerExists));
        localStorage.setItem("token", data.token);
        console.log("Seller data saved:", {
          seller: data.sellerExists,
          token: data.token,
        });
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "Login failed" };
    }
  };

  // Customer logout function
  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
  };

  // Seller logout function
  const logoutSeller = () => {
    setSeller(null);
    localStorage.removeItem("seller");
    localStorage.removeItem("token");
  };

  // Add function to fetch sellers
  const fetchSellers = useCallback(async () => {
    try {
      const data = await sellerAPI.getAllSellers();
      setSellers(data.getAllSellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  }, []);

  // Ensure fetchGalleryItems is defined and works
  const fetchGalleryItems = useCallback(async (sellerId) => {
    if (!sellerId) {
      console.warn("fetchGalleryItems called without sellerId");
      setGalleryItems([]); // Clear items if no sellerId
      return;
    }
    try {
      const data = await galleryAPI.getAllGallery(sellerId);
      setGalleryItems(data.galleryItems || []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setGalleryItems([]); // Clear on error
    }
  }, []);

  // ****** DEFINE fetchReviews BEFORE createReview ******
  const fetchReviews = useCallback(async (sellerId) => {
    if (!sellerId) {
      console.warn("fetchReviews called without sellerId");
      setReviews([]);
      return;
    }
    try {
      const data = await reviewAPI.getAllReviews(sellerId);
      setReviews(data.reviews || []);
      return data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  }, []);

  // Ensure fetchOffers is defined and wrapped in useCallback
  const fetchOffers = useCallback(async (sellerId) => {
    if (!sellerId) {
      console.warn("fetchOffers called without sellerId");
      setOffers([]);
      return;
    }
    try {
      const data = await offerAPI.getAllOffers(sellerId);
      setOffers(data.offers || []); // Ensure array
    } catch (error) {
      console.error("Error fetching offers:", error);
      setOffers([]);
    }
  }, []);

  const fetchAllOffers = async () => {
    try {
      const data = await offerAPI.getAllOffers();
      setOffers(data.offers);
    } catch (error) {
      console.error("Error fetching all offers:", error);
    }
  };

  // Add function to fetch all offers from all sellers
  const fetchAllSellerOffers = useCallback(async () => {
    try {
      const data = await offerAPI.getAllOffersFromSellers();
      setAllSellerOffers(data.offers);
    } catch (error) {
      console.error("Error fetching all seller offers:", error);
    }
  }, []);

  // Add function to fetch sellers leaderboard
  const fetchSellersLeaderboard = useCallback(async () => {
    try {
      const data = await sellerAPI.getSellersLeaderboard();
      setSellersLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Error fetching sellers leaderboard:", error);
    }
  }, []);

  // ****** DEFINE fetchFavoriteStores BEFORE addFavoriteStore ******
  const fetchFavoriteStores = useCallback(async () => {
    if (!customer?._id) {
      setFavoriteStores([]);
      return;
    }
    try {
      const data = await customerAPI.getFavoriteStores(customer._id);
      setFavoriteStores(data.favoriteStores || []);
    } catch (error) {
      console.error("Error fetching favorite stores:", error);
      setFavoriteStores([]);
    }
  }, [customer]);

  // ****** DEFINE calculateBatches BEFORE updateCustomerPoints ******
  const calculateBatches = useCallback((points) => {
    const batches = ["Iron"];
    if (points > 50) batches.push("Silver");
    if (points > 100) batches.push("Gold");
    if (points > 200) batches.push("Platinum");
    return batches;
  }, []);

  // Add this function near calculateBatches
  const calculateTitle = useCallback((points) => {
    if (points > 200) return "Expert";
    if (points > 100) return "Pro";
    if (points > 50) return "Intermediate";
    return "Newbie";
  }, []);

  // --- THEN Define Action Functions that DEPEND on Fetch Functions ---

  const createReview = useCallback(
    async (reviewData) => {
      if (!reviewData?.sellerId) {
        return { success: false, message: "Seller ID missing in review data." };
      }
      try {
        // Now fetchReviews is guaranteed to be initialized
        const data = await reviewAPI.createReview(reviewData);
        if (data.success) {
          fetchReviews(reviewData.sellerId); // Okay to call now
          return { success: true };
        }
        return { success: false, message: data.message };
      } catch (error) {
        console.error("Create review error:", error);
        return {
          success: false,
          message: error.message || "Failed to create review",
        };
      }
    },
    [fetchReviews] // Dependency is fine now
  );

  const addFavoriteStore = useCallback(
    async (storeData) => {
      if (!customer?._id) {
        alert("You need to login / register first");
        return { success: false };
      }
      try {
        // Now fetchFavoriteStores is guaranteed to be initialized
        const data = await customerAPI.addFavoriteStore(
          customer._id,
          storeData
        );
        if (data.success) {
          fetchFavoriteStores(); // Okay to call now
          return { success: true };
        }
        return { success: false, message: data.message };
      } catch (error) {
        console.error("Add favorite store error:", error);
        if (error.message.includes("already in favorites")) {
          alert("This store is already in your favorite store list");
        }
        return { success: false, message: error.message };
      }
    },
    [customer, fetchFavoriteStores] // Dependencies fine now
  );

  const updateCustomerPoints = useCallback(
    async (pointsToAdd) => {
      if (!customer?._id) return;
      try {
        const data = await customerAPI.updatePoints(customer._id, pointsToAdd);
        if (data.success) {
          const newBatches = calculateBatches(data.updatedCustomer.points);
          const newTitle = calculateTitle(data.updatedCustomer.points);
          const updatedCustomer = {
            ...customer,
            points: data.updatedCustomer.points,
            batch: newBatches,
            title: newTitle,
          };
          setCustomer(updatedCustomer);
          localStorage.setItem("customer", JSON.stringify(updatedCustomer));
        }
      } catch (error) {
        console.error("Error updating points:", error);
      }
    },
    [customer, calculateBatches, calculateTitle] // Add calculateTitle to dependencies
  );

  const updateSellerProfileVisit = useCallback(async (sellerId) => {
    try {
      const data = await sellerAPI.updateProfileVisit(sellerId);
      if (data.success) {
        // If the seller is in the leaderboard, update their visit count
        setSellersLeaderboard((prevLeaderboard) =>
          prevLeaderboard.map((seller) =>
            seller._id === sellerId
              ? { ...seller, profile_visit: data.updatedSeller.profile_visit }
              : seller
          )
        );
      }
    } catch (error) {
      console.error("Error updating profile visit:", error);
    }
  }, []);

  // Add new function to fetch exclusive offers
  const fetchExclusiveOffers = useCallback(async (sellerId) => {
    if (!sellerId) {
      console.warn("fetchExclusiveOffers called without sellerId");
      setExclusiveOffers([]);
      return;
    }
    try {
      const data = await exclusiveOfferAPI.getAllExclusiveOffers(sellerId);
      setExclusiveOffers(data.offers || []);
    } catch (error) {
      console.error("Error fetching exclusive offers:", error);
      setExclusiveOffers([]);
    }
  }, []);

  // ADD fetchCustomersLeaderboard function
  const fetchCustomersLeaderboard = useCallback(async () => {
    try {
      const data = await customerAPI.getCustomersLeaderboard();
      setCustomersLeaderboard(data.leaderboard || []); // Ensure array
    } catch (error) {
      console.error("Error fetching customers leaderboard:", error);
      setCustomersLeaderboard([]); // Clear on error
    }
  }, []); // No dependencies needed from scope

  // Add this function
  const updateCustomerProfile = useCallback(
    async (customerData) => {
      if (!customer?._id)
        return { success: false, message: "No customer logged in" };

      try {
        const data = await customerAPI.updateCustomer(
          customer._id,
          customerData
        );

        if (data.success) {
          const updatedCustomer = {
            ...customer,
            ...data.updatedCustomer,
          };

          setCustomer(updatedCustomer);
          localStorage.setItem("customer", JSON.stringify(updatedCustomer));

          return { success: true, message: "Profile updated successfully" };
        }

        return {
          success: false,
          message: data.message || "Failed to update profile",
        };
      } catch (error) {
        console.error("Update customer profile error:", error);
        return {
          success: false,
          message: error.message || "Failed to update profile",
        };
      }
    },
    [customer]
  );

  const removeFavoriteStore = useCallback(
    async (sellerId) => {
      if (!customer?._id) {
        return { success: false, message: "No customer logged in" };
      }
      try {
        const data = await customerAPI.removeFavoriteStore(
          customer._id,
          sellerId
        );
        if (data.success) {
          fetchFavoriteStores(); // Refresh the list after removal
          return { success: true };
        }
        return { success: false, message: data.message };
      } catch (error) {
        console.error("Remove favorite store error:", error);
        return { success: false, message: error.message };
      }
    },
    [customer, fetchFavoriteStores]
  );

  const value = {
    title: {
      newbie: "Newbie",
      intermediate: "Intermediate",
      pro: "Pro",
      expert: "Expert",
    },
    batch: {
      iron: "Iron",
      silver: "Silver",
      gold: "Gold",
      platinum: "Platinum",
    },
    backendUrl,
    customer,
    seller,
    setSeller,
    sellers,
    galleryItems,
    reviews,
    offers,
    allSellerOffers,
    sellersLeaderboard,
    favoriteStores,
    exclusiveOffers,
    customersLeaderboard,
    loginCustomer,
    loginSeller,
    logoutCustomer,
    logoutSeller,
    fetchSellers,
    fetchGalleryItems,
    createReview,
    fetchReviews,
    fetchOffers,
    fetchAllOffers,
    fetchAllSellerOffers,
    fetchSellersLeaderboard,
    addFavoriteStore,
    fetchFavoriteStores,
    updateCustomerPoints,
    updateSellerProfileVisit,
    fetchExclusiveOffers,
    calculateBatches,
    calculateTitle,
    fetchCustomersLeaderboard,
    updateCustomerProfile,
    removeFavoriteStore,
  };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
