import { useState, useEffect, useContext, useRef } from "react";
import { StoreContext } from "../../context/StoreContext";
import { offerAPI } from "../../services/api"; // Assuming offerAPI is in api.js
import "./OfferDashboardContent.css"; // We'll create this CSS file

const OfferDashboardContent = () => {
  const { seller, offers, fetchOffers } = useContext(StoreContext); // Use offers state and fetchOffers
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for the Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for 'Add', item object for 'Edit'
  const [formData, setFormData] = useState({
    product_description: "",
    old_price: "",
    new_price: "",
    imageFile: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch items on component mount or seller change
  useEffect(() => {
    if (seller?._id) {
      fetchOffers(seller._id); // Use fetchOffers
    }
  }, [seller, fetchOffers]);

  // ---- Modal Handling ----
  const openAddModel = () => {
    setEditingItem(null);
    setFormData({
      product_description: "",
      old_price: "",
      new_price: "",
      imageFile: null,
    });
    setPreviewImage(null);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      product_description: item.product_description || "",
      old_price: item.old_price || "",
      new_price: item.new_price || "",
      imageFile: null, // Don't prefill file input
    });
    setPreviewImage(item.image); // Show current image
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // ---- Form Handling ----
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ---- API Calls ----
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Simple validation
    if (
      !formData.product_description ||
      !formData.old_price ||
      !formData.new_price
    ) {
      setError("Description, Old Price, and New Price are required.");
      setIsLoading(false);
      return;
    }
    if (Number(formData.new_price) >= Number(formData.old_price)) {
      setError("New Price must be less than Old Price.");
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("product_description", formData.product_description);
    data.append("old_price", formData.old_price);
    data.append("new_price", formData.new_price);

    if (!seller?._id) {
      setError("Seller information is missing.");
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (editingItem) {
        // Update
        if (formData.imageFile) {
          data.append("image", formData.imageFile);
        }
        response = await offerAPI.updateOffer(editingItem._id, data);
        setSuccess("Offer updated successfully!");
      } else {
        // Create
        if (!formData.imageFile) {
          setError("Image is required for new offers.");
          setIsLoading(false);
          return;
        }
        data.append("sellerId", seller._id); // Add sellerId for create
        data.append("image", formData.imageFile);
        response = await offerAPI.createOffer(data);
        setSuccess("Offer added successfully!");
      }

      if (response.success) {
        fetchOffers(seller._id); // Refresh list using fetchOffers
        closeModal();
      } else {
        setError(response.message || "Operation failed.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setIsLoading(true);
      setError("");
      setSuccess("");
      try {
        const response = await offerAPI.deleteOffer(itemId);
        if (response.success) {
          setSuccess("Offer deleted successfully!");
          fetchOffers(seller._id); // Refresh list using fetchOffers
        } else {
          setError(response.message || "Delete operation failed.");
        }
      } catch (err) {
        setError(err.message || "An error occurred during deletion.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="offer-dashboard-content">
      <button onClick={openAddModel} className="add-new-item-btn">
        + Add New Offer
      </button>
      {isLoading && <p>Loading offers...</p>}
      <div className="offer-grid">
        {" "}
        {/* Changed class name */}
        {offers && offers.length > 0
          ? offers.map((item) => (
              <div key={item._id} className="offer-card">
                {" "}
                {/* Changed class name */}
                <img
                  src={item.image}
                  alt={item.product_description || "Offer item"}
                  className="offer-card-img" // Changed class name
                />
                <div className="offer-card-info">
                  {" "}
                  {/* Changed class name */}
                  <p className="offer-card-desc">
                    {" "}
                    {/* Changed class name */}
                    {item.product_description || "No description"}
                  </p>
                  <div className="offer-card-prices">
                    {" "}
                    {/* Price container */}
                    <p className="offer-card-old-price">Rs. {item.old_price}</p>
                    <p className="offer-card-new-price">Rs. {item.new_price}</p>
                  </div>
                </div>
                <div className="offer-card-actions">
                  {" "}
                  {/* Changed class name */}
                  <button
                    onClick={() => openEditModal(item)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          : !isLoading && <p>No offers found. Add your first offer!</p>}
      </div>
      <br />
      <br />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingItem ? "Edit Offer" : "Add New Offer"}</h3>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="product_description">Description*</label>
                <input
                  type="text"
                  id="product_description"
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  placeholder="Enter offer description"
                  required
                />
              </div>
              <div className="form-group price-group">
                {" "}
                {/* Group prices */}
                <div>
                  <label htmlFor="old_price">Old Price (Rs.)*</label>
                  <input
                    type="number"
                    id="old_price"
                    name="old_price"
                    value={formData.old_price}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new_price">New Price (Rs.)*</label>
                  <input
                    type="number"
                    id="new_price"
                    name="new_price"
                    value={formData.new_price}
                    onChange={handleInputChange}
                    placeholder="e.g., 1200"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="imageFile">
                  Image {editingItem ? "(Optional: Upload to replace)" : "*"}
                </label>
                <input
                  type="file"
                  id="imageFile"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="image-preview"
                  />
                )}
              </div>
              <div className="modal-actions">
                <button type="submit" disabled={isLoading} className="save-btn">
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferDashboardContent;
