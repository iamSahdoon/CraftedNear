import { useState, useEffect, useContext, useRef } from "react";
import { StoreContext } from "../../context/StoreContext";
import { exclusiveOfferAPI } from "../../services/api"; // Use exclusiveOfferAPI
import "./ExclusiveOfferDashboardContent.css"; // New CSS file

const ExclusiveOfferDashboardContent = () => {
  // Use exclusive offers state and fetch function from context
  const { seller, exclusiveOffers, fetchExclusiveOffers } =
    useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for the Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    product_description: "",
    old_price: "",
    new_price: "",
    customer_point_threshold: "", // Add threshold field
    imageFile: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch exclusive offers
  useEffect(() => {
    if (seller?._id) {
      fetchExclusiveOffers(seller._id); // Fetch exclusive offers
    }
  }, [seller, fetchExclusiveOffers]);

  // ---- Modal Handling ----
  const openAddModel = () => {
    setEditingItem(null);
    setFormData({
      product_description: "",
      old_price: "",
      new_price: "",
      customer_point_threshold: "", // Reset threshold
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
      customer_point_threshold: item.customer_point_threshold || "", // Pre-fill threshold
      imageFile: null,
    });
    setPreviewImage(item.image);
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

    // Validation
    if (
      !formData.product_description ||
      !formData.old_price ||
      !formData.new_price ||
      !formData.customer_point_threshold // Validate threshold
    ) {
      setError("All fields (including Point Threshold) are required.");
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
    data.append("customer_point_threshold", formData.customer_point_threshold); // Add threshold

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
        response = await exclusiveOfferAPI.updateExclusiveOffer(
          editingItem._id,
          data
        );
        setSuccess("Exclusive Offer updated successfully!");
      } else {
        // Create
        if (!formData.imageFile) {
          setError("Image is required for new exclusive offers.");
          setIsLoading(false);
          return;
        }
        data.append("sellerId", seller._id);
        data.append("image", formData.imageFile);
        response = await exclusiveOfferAPI.createExclusiveOffer(data);
        setSuccess("Exclusive Offer added successfully!");
      }

      if (response.success) {
        fetchExclusiveOffers(seller._id); // Refresh list
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
    if (
      window.confirm("Are you sure you want to delete this exclusive offer?")
    ) {
      setIsLoading(true);
      setError("");
      setSuccess("");
      try {
        const response = await exclusiveOfferAPI.deleteExclusiveOffer(itemId);
        if (response.success) {
          setSuccess("Exclusive Offer deleted successfully!");
          fetchExclusiveOffers(seller._id); // Refresh list
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
    <div className="exclusive-offer-dashboard-content">
      <button onClick={openAddModel} className="add-new-item-btn">
        + Add New Exclusive Offer
      </button>
      {isLoading && <p>Loading exclusive offers...</p>}
      <div className="exclusive-offer-grid">
        {" "}
        {/* Changed class */}
        {exclusiveOffers && exclusiveOffers.length > 0
          ? exclusiveOffers.map((item) => (
              <div key={item._id} className="exclusive-offer-card">
                {" "}
                {/* Changed class */}
                <img
                  src={item.image}
                  alt={item.product_description || "Exclusive offer item"}
                  className="exclusive-offer-card-img" // Changed class
                />
                <div className="exclusive-offer-card-info">
                  {" "}
                  {/* Changed class */}
                  <p className="exclusive-offer-card-desc">
                    {" "}
                    {/* Changed class */}
                    {item.product_description || "No description"}
                  </p>
                  <div className="exclusive-offer-card-details">
                    {" "}
                    {/* Container for prices & threshold */}
                    <div className="exclusive-offer-card-prices">
                      {" "}
                      {/* Changed class */}
                      <p className="exclusive-offer-card-old-price">
                        {" "}
                        {/* Changed class */}
                        Rs. {item.old_price}
                      </p>
                      <p className="exclusive-offer-card-new-price">
                        {" "}
                        {/* Changed class */}
                        Rs. {item.new_price}
                      </p>
                    </div>
                    <p className="exclusive-offer-card-threshold">
                      {" "}
                      {/* New class */}
                      Req. Points: {item.customer_point_threshold}
                    </p>
                  </div>
                </div>
                <div className="exclusive-offer-card-actions">
                  {" "}
                  {/* Changed class */}
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
          : !isLoading && <p>No exclusive offers found. Add your first one!</p>}
      </div>
      <br />
      <br />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {editingItem ? "Edit Exclusive Offer" : "Add New Exclusive Offer"}
            </h3>
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
                {/* Reuse price group style */}
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
              {/* Add Customer Point Threshold Input */}
              <div className="form-group">
                <label htmlFor="customer_point_threshold">
                  Required Customer Points*
                </label>
                <input
                  type="number" // Or text if you store thresholds like 'Silver', 'Gold'
                  id="customer_point_threshold"
                  name="customer_point_threshold"
                  value={formData.customer_point_threshold}
                  onChange={handleInputChange}
                  placeholder="e.g., 100" // Adjust placeholder based on type
                  min="0" // If numeric
                  required
                />
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

export default ExclusiveOfferDashboardContent;
