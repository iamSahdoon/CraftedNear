import "./CSS/Login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import Navbar1 from "../components/navbar/Navbar1";
import Footer from "../components/footer/Footer";
import HerotextLogin from "../components/hero-text/HerotextLogin";

const Login = () => {
  // Customer state
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [customerError, setCustomerError] = useState("");

  // Seller state
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPassword, setSellerPassword] = useState("");
  const [sellerError, setSellerError] = useState("");

  const { loginCustomer, loginSeller } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    const result = await loginCustomer(customerEmail, customerPassword);

    if (result.success) {
      navigate("/customer/profile");
    } else {
      setCustomerError(result.message);
    }
  };

  const handleSellerLogin = async (e) => {
    e.preventDefault();
    const result = await loginSeller(sellerEmail, sellerPassword);

    if (result.success) {
      navigate("/seller/dashboard");
    } else {
      setSellerError(result.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <Navbar1 />
        <HerotextLogin text={"DISCOVER & CONNECT"} />
        <div className="login-wrapper">
          {/* Customer Login Section */}
          <div className="cus-login">
            <p>CUSTOMER LOG IN</p>
            {customerError && <p className="error-message">{customerError}</p>}
            <form onSubmit={handleCustomerLogin}>
              <div className="input-login">
                <input
                  className="input-email"
                  type="email"
                  placeholder="EMAIL *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <input
                  className="input-password"
                  type="password"
                  placeholder="PASSWORD *"
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                />
              </div>
              <button type="submit">LOGIN</button>
            </form>
          </div>

          {/* Seller Login Section */}
          <div className="sell-login">
            <p>SELLER LOG IN</p>
            {sellerError && <p className="error-message">{sellerError}</p>}
            <form onSubmit={handleSellerLogin}>
              <div className="input-login">
                <input
                  className="input-email"
                  type="email"
                  placeholder="EMAIL *"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                />
                <input
                  className="input-password"
                  type="password"
                  placeholder="PASSWORD *"
                  value={sellerPassword}
                  onChange={(e) => setSellerPassword(e.target.value)}
                />
              </div>
              <button type="submit">LOGIN</button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
