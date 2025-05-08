import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import { Navigate } from "react-router-dom";
import "./CSS/CustomerProfile.css";
import Navbar1 from "../components/navbar/Navbar1";
import Footer from "../components/footer/Footer";
import HeroCustomer from "../components/hero-text/HeroCustomer";
import Title from "../components/homepage/Title";
import Batch from "../components/gamification/Batch";
import Store from "../components/stores/Store";

const CustomerProfile = () => {
  const {
    customer,
    title,
    batch,
    sellersLeaderboard,
    fetchSellersLeaderboard,
    favoriteStores,
    fetchFavoriteStores,
    updateCustomerProfile,
    removeFavoriteStore,
  } = useContext(StoreContext);

  const [isLoading, setIsLoading] = useState(true);
  // Add separate form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form data when customer data changes
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        location: customer.location || "",
        password: "", // Password is always empty initially
      });
    }
  }, [customer]);

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (!storedCustomer) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellersLeaderboard();
  }, [fetchSellersLeaderboard]);

  useEffect(() => {
    if (customer) {
      fetchFavoriteStores();
    }
  }, [customer, fetchFavoriteStores]);

  const getCurrentBatches = () => {
    if (!customer) return [batch.iron];
    const points = customer.points;
    const batches = ["Iron"];
    if (points > 50) batches.push("Silver");
    if (points > 100) batches.push("Gold");
    if (points > 200) batches.push("Platinum");
    return batches;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Prepare data for update (only include fields with values)
    const updateData = {};
    if (formData.name) updateData.name = formData.name;
    if (formData.email) updateData.email = formData.email;
    if (formData.location) updateData.location = formData.location;
    if (formData.password) updateData.password = formData.password;

    if (Object.keys(updateData).length === 0) {
      setError("No changes to save");
      return;
    }

    try {
      const result = await updateCustomerProfile(updateData);
      if (result.success) {
        setSuccess("Profile updated successfully");
        // Form data was already updated by the useEffect that watches customer
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="customer-profile-container">
        <Navbar1 />
        <HeroCustomer
          name={customer.name}
          title={customer.title || title.newbie}
          email={customer.email}
          points={customer.points}
          location={customer.location}
        />

        {/* Favorite Store Section */}
        <Title text1="Favorite" text2="-Stores" />
        <div className="stores">
          {favoriteStores && favoriteStores.length > 0 ? (
            favoriteStores.map((store) => (
              <div key={store.sellerId} className="favorite-store-wrapper">
                <Store
                  storename={store.storeName}
                  storeimg={store.storeAvatar}
                />
                <button
                  className="remove-favorite-btn"
                  onClick={async () => {
                    const result = await removeFavoriteStore(store.sellerId);
                    if (!result.success) {
                      alert(
                        result.message ||
                          "Failed to remove store from favorites"
                      );
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No favorite stores yet</p>
          )}
        </div>

        {/* Trophies Section */}
        <Title text1="T" text2="rophies" />
        <div className="trophies-container">
          <Batch batches={getCurrentBatches()} />
        </div>

        {/* Leaderboard Section */}
        <Title text1="L" text2="eaderboard" />
        <table className="p-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Store Name</th>
              <th>Location</th>
              <th>Visits</th>
            </tr>
          </thead>
          <tbody>
            {sellersLeaderboard && sellersLeaderboard.length > 0 ? (
              sellersLeaderboard.map((seller) => (
                <tr key={seller.rank}>
                  <td>{seller.rank}</td>
                  <td>{seller.name}</td>
                  <td>{seller.city}</td>
                  <td>{seller.profile_visit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No sellers found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Edit Profile Section */}
        <Title text1="Edit" text2="-Profile" />

        <form className="customer-update-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="form-label">Name</div>
            <div className="form-label">Email</div>
            <div className="form-label">Location</div>
            <div className="form-label">Password</div>
          </div>
          <div className="form-inputs">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
            />
            <input
              type="password"
              name="password"
              className="password-cus"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password (leave blank to keep current)"
            />
          </div>
          <button type="submit" className="update-button">
            Update Profile
          </button>
          {error && <p className="error-message-cus">{error}</p>}
          {success && <p className="success-message-cus">{success}</p>}
        </form>
        <Footer />
      </div>
    </>
  );
};

export default CustomerProfile;
