import { useState, useEffect, useContext, useRef } from "react";
import { StoreContext } from "../../context/StoreContext";
import { sellerAPI } from "../../services/api"; // Assuming sellerAPI has updateStore
import "./StoreDashboardContent.css"; // New CSS file

const StoreDashboardContent = () => {
  const { seller, setSeller } = useContext(StoreContext); // Need setSeller from context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "", // Corresponds to store.name
    store_description: "", // Corresponds to store.store_description
    imageFile: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Pre-fill form when seller data is available
  useEffect(() => {
    if (seller?.store) {
      setFormData({
        name: seller.store.name || "",
        store_description: seller.store.store_description || "",
        imageFile: null, // Don't prefill file input
      });
      setPreviewImage(seller.store.avatar || null); // Set current avatar as preview
    }
  }, [seller]); // Re-run if seller data changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      // Optional: If user cancels file selection, revert preview
      // setFormData(prev => ({ ...prev, imageFile: null }));
      // setPreviewImage(seller?.store?.avatar || null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!seller?._id) {
      setError("Cannot save changes. Seller information missing.");
      setIsLoading(false);
      return;
    }

    const data = new FormData();

    // Only append changed fields
    if (formData.name !== (seller?.store?.name || "")) {
      data.append("name", formData.name);
    }
    if (
      formData.store_description !== (seller?.store?.store_description || "")
    ) {
      data.append("store_description", formData.store_description);
    }
    if (formData.imageFile) {
      data.append("avatar", formData.imageFile); // Backend route expects 'avatar'
    }

    // Check if any data is actually being sent
    if ([...data.entries()].length === 0) {
      setSuccess("No changes detected.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await sellerAPI.updateStore(seller._id, data);

      if (response.success) {
        setSuccess("Store details updated successfully!");
        // Update context and local storage with the *new* seller data from response
        setSeller(response.updatedSeller);
        localStorage.setItem("seller", JSON.stringify(response.updatedSeller));
        // Reset imageFile state after successful upload
        setFormData((prev) => ({ ...prev, imageFile: null }));
      } else {
        setError(response.message || "Update failed.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while saving changes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="store-dashboard-content">
      <form onSubmit={handleSaveChanges}>
        <div className="store-name-container">
          <div className="profile-visit">
            Total profile visits: {seller?.profile_visit || 0}
          </div>
          <br />
          <label htmlFor="store-name">Store Name*</label>
          <input
            type="text"
            id="store-name"
            name="name" // Match backend expected field for store.name
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your store name"
            required
          />
        </div>
        <div className="store-image-container">
          <label htmlFor="store-image">Store Image (Avatar)</label>
          <input
            type="file"
            id="store-image"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="image-upload-area" onClick={handleImageClick}>
            {previewImage ? (
              <img src={previewImage} alt="Store Preview" />
            ) : (
              <div className="image-upload-placeholder">
                <p>Click to upload store image</p>
              </div>
            )}
          </div>
          <small>Upload a new image to replace the current one.</small>
        </div>
        <div className="store-description-container">
          <label htmlFor="store-description">Store Description*</label>
          <textarea
            id="store-description"
            name="store_description" // Match backend expected field
            value={formData.store_description}
            onChange={handleInputChange}
            placeholder="Describe your store..."
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default StoreDashboardContent;
