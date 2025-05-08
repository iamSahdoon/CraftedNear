import { useState, useEffect, useContext, useRef } from "react";
import { StoreContext } from "../../context/StoreContext";
import { galleryAPI } from "../../services/api"; // Assuming galleryAPI is in api.js
import "./GalleryDashboardContent.css"; // We'll create this CSS file

const GalleryDashboardContent = () => {
  const { seller, galleryItems, fetchGalleryItems } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for the Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for 'Add', item object for 'Edit'
  const [formData, setFormData] = useState({
    product_description: "",
    price: "",
    imageFile: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch items on component mount or seller change
  useEffect(() => {
    if (seller?._id) {
      fetchGalleryItems(seller._id);
    }
  }, [seller, fetchGalleryItems]);

  // ---- Modal Handling ----
  const openAddModel = () => {
    setEditingItem(null);
    setFormData({ product_description: "", price: "", imageFile: null });
    setPreviewImage(null);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      product_description: item.product_description || "",
      price: item.price || "",
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

    const data = new FormData();
    data.append("product_description", formData.product_description);
    data.append("price", formData.price);

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
        // Note: Our backend update handles skipping image if not provided in FormData
        response = await galleryAPI.updateGallery(editingItem._id, data);
        setSuccess("Item updated successfully!");
      } else {
        // Create
        if (!formData.imageFile) {
          setError("Image is required for new items.");
          setIsLoading(false);
          return;
        }
        data.append("sellerId", seller._id); // Add sellerId for create
        data.append("image", formData.imageFile);
        response = await galleryAPI.createGallery(data);
        setSuccess("Item added successfully!");
      }

      if (response.success) {
        fetchGalleryItems(seller._id); // Refresh list
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
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      setIsLoading(true);
      setError("");
      setSuccess("");
      try {
        const response = await galleryAPI.deleteGallery(itemId);
        if (response.success) {
          setSuccess("Item deleted successfully!");
          fetchGalleryItems(seller._id); // Refresh list
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
    <div className="gallery-dashboard-content">
      <button onClick={openAddModel} className="add-new-item-btn">
        + Add New Gallery Item
      </button>

      {isLoading && <p>Loading items...</p>}

      <div className="gallery-grid">
        {galleryItems && galleryItems.length > 0
          ? galleryItems.map((item) => (
              <div key={item._id} className="gallery-card">
                <img
                  src={item.image}
                  alt={item.product_description || "Gallery item"}
                  className="gallery-card-img"
                />
                <div className="gallery-card-info">
                  <p className="gallery-card-desc">
                    {item.product_description || "No description"}
                  </p>
                  <p className="gallery-card-price">
                    {item.price ? `Rs. ${item.price}` : "No price"}
                  </p>
                </div>
                <div className="gallery-card-actions">
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
          : !isLoading && <p>No gallery items found. Add your first item!</p>}
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
              {editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}
            </h3>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="product_description">Description</label>
                <input
                  type="text"
                  id="product_description"
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price (Rs.)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price (optional)"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="imageFile">
                  Image {editingItem ? "(Optional: Upload to replace)" : "*"}
                </label>
                <input
                  type="file"
                  id="imageFile"
                  ref={fileInputRef} // Use ref if needed for specific interactions
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

export default GalleryDashboardContent;
