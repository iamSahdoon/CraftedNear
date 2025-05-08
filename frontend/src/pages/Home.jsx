import "./CSS/Home.css";
import CN_bg from "../assets/svgs/CraftedNear_background.svg";

import Navbar1 from "../components/navbar/Navbar1";
import Title from "../components/homepage/Title";
import Store from "../components/stores/Store";
import Footer from "../components/footer/Footer";
import Category from "../components/homepage/Category";
import default_store_img from "../assets/images/store.png";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";

const Home = () => {
  const { customer, sellers, fetchSellers } = useContext(StoreContext);
  const [filteredSellers, setFilteredSellers] = useState([]);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    if (sellers && customer) {
      // Filter sellers based on the customer's location
      const filtered = sellers.filter(
        (seller) =>
          seller.city.toLowerCase() === customer.location.toLowerCase()
      );
      setFilteredSellers(filtered);
    }
  }, [sellers, customer]);

  if (!sellers) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="home-container">
        <Navbar1 />
        {/* hero section */}
        <div className="hero-section">
          <div className="hero-img-container">
            <img src={CN_bg} alt="store_image" />
          </div>
          <div className="hr-container2"></div>
          <div className="hero-text-container">
            {/* <h1>
              <span>C</span>RAFTED <span>N</span>EAR
            </h1> */}
            <h1 className="italic">C</h1>
            <h1>R</h1>
            <h1>A</h1>
            <h1>F</h1>
            <h1 className="m-left">T</h1>
            <h1>E</h1>
            <h1>D </h1>
            <h1 className="italic m-left">N</h1>
            <h1>E</h1>
            <h1>A</h1>
            <h1>R</h1>
          </div>
          <div className="sub-hero-text-container">
            <h2>Access stores near your area</h2>
            <hr />
          </div>
        </div>
        {/* middle section */}
        {customer && (
          <div className="mid-section-1 link">
            <Title
              text1={"Stores"}
              text2={"-Near you"}
              text3={customer.location}
              text4={"View all"}
            />
            <div className="stores justify-content">
              {filteredSellers && filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <Link
                    to="/seller/gallery"
                    state={{ sellerData: seller }}
                    key={seller._id}
                  >
                    <Store
                      storename={seller.store?.name || "Unnamed Store"}
                      storeimg={seller.store?.avatar || default_store_img}
                      sellerId={seller._id}
                    />
                  </Link>
                ))
              ) : (
                <p>No stores found in your location</p>
              )}
            </div>
          </div>
        )}
        <div className="mid-section-2 link">
          <Title
            text1={"New"}
            text2={"-Stores"}
            text3={""}
            text4={"View all"} //need link
          />
          <div className="stores">
            {sellers && sellers.length > 0 ? (
              sellers.map((seller) => (
                <Link
                  to="/seller/gallery"
                  state={{ sellerData: seller }}
                  key={seller._id}
                >
                  <Store
                    storename={seller.store?.name || "Unnamed Store"}
                    storeimg={seller.store?.avatar || default_store_img}
                    sellerId={seller._id}
                  />
                </Link>
              ))
            ) : (
              <p>Loading stores...</p>
            )}
          </div>
        </div>
        <div className="mid-section-3">
          <Title
            text1={"Store"}
            text2={"-Categories"}
            text3={""}
            text4={""} //need link
          />
          <div className="category-wrapper">
            <Category />
          </div>
        </div>
        {/* Footer */}
        <div className="footer-wrapper">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
