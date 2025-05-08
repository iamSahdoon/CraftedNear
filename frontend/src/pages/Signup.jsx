import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Signup.css";

import Navbar1 from "../components/navbar/Navbar1";
import Footer from "../components/footer/Footer";
import { customerAPI, sellerAPI } from "../services/api";
import { StoreContext } from "../context/StoreContext";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { updateCustomerPoints } = useContext(StoreContext);

  // Seller form state
  const [sellerForm, setSellerForm] = useState({
    name: "",
    city: "",
    location: "",
    tel: "",
    store_category: "",
    email: "",
    password: "",
  });

  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    name: "",
    location: "",
    email: "",
    password: "",
  });

  // Handle seller registration
  const handleSellerSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields are filled
    if (Object.values(sellerForm).some((field) => !field)) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await sellerAPI.register(sellerForm);
      if (response.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(error.message || "Registration failed");
    }
  };

  // Handle customer registration
  const handleCustomerSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields are filled
    if (Object.values(customerForm).some((field) => !field)) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Add initial points to the customer data
      const customerData = {
        ...customerForm,
        points: 10, // Set initial points
      };

      const response = await customerAPI.register(customerData);
      if (response.success) {
        setSuccess("Registration successful! Redirecting to login...");

        // After successful registration, update points through the context
        // This ensures the points are properly tracked in the system
        if (response.savedCustomer && response.savedCustomer._id) {
          await updateCustomerPoints(10);
        }

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(error.message || "Registration failed");
    }
  };

  return (
    <>
      <div className="login-container">
        <Navbar1 />
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="login-wrapper-signup">
          <div className="sell-signup">
            <p>SELLER SIGN UP</p>
            <div className="input-login">
              <input
                type="text"
                placeholder="USERNAME *"
                value={sellerForm.name}
                onChange={(e) =>
                  setSellerForm({ ...sellerForm, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="CITY *"
                value={sellerForm.city}
                onChange={(e) =>
                  setSellerForm({ ...sellerForm, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="LOCATION *"
                value={sellerForm.location}
                onChange={(e) =>
                  setSellerForm({ ...sellerForm, location: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="PHONE *"
                maxLength="10"
                value={sellerForm.tel}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setSellerForm({ ...sellerForm, tel: value });
                }}
                inputMode="numeric"
              />
              <input
                type="text"
                placeholder="STORE CATEGORY *"
                value={sellerForm.store_category}
                onChange={(e) =>
                  setSellerForm({
                    ...sellerForm,
                    store_category: e.target.value,
                  })
                }
              />
              <input
                className="input-email"
                type="email"
                placeholder="EMAIL *"
                value={sellerForm.email}
                onChange={(e) =>
                  setSellerForm({ ...sellerForm, email: e.target.value })
                }
              />
              <input
                className="input-password"
                type="password"
                placeholder="PASSWORD *"
                value={sellerForm.password}
                onChange={(e) =>
                  setSellerForm({ ...sellerForm, password: e.target.value })
                }
              />
              <button onClick={handleSellerSignup}>SIGNUP</button>
            </div>
          </div>
          <div className="cus-signup">
            <p>CUSTOMER SIGN UP</p>
            <div className="input-signup">
              <input
                type="text"
                placeholder="USERNAME *"
                value={customerForm.name}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="CITY *"
                value={customerForm.location}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, location: e.target.value })
                }
              />
              <input
                className="input-email"
                type="email"
                placeholder="EMAIL *"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, email: e.target.value })
                }
              />
              <input
                className="input-password"
                type="password"
                placeholder="PASSWORD *"
                value={customerForm.password}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, password: e.target.value })
                }
              />
              <button onClick={handleCustomerSignup}>SIGNUP</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Signup;
