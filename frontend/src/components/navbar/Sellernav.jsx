import "./Sellernav.css";
import PropTypes from "prop-types";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

// import seller_nav from "../../assets/navbar/seller_nav.svg";
// import offers_nav from "../../assets/navbar/offers_nav.svg";
// import e_offers_nav from "../../assets/navbar/e_offers_nav.svg";
// import reviews_nav from "../../assets/navbar/reviews_nav.svg";

const Sellernav = ({ activeTab, setActiveTab, showExclusiveOffers }) => {
  const { customer, updateCustomerPoints } = useContext(StoreContext);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (customer) {
      updateCustomerPoints(2);
    }
  };

  return (
    <>
      <div className="profile-navbar">
        <button
          onClick={() => handleTabClick("gallery")}
          className={activeTab === "gallery" ? "active" : ""}
        >
          Gallery
        </button>
        <button
          onClick={() => handleTabClick("offers")}
          className={`big-pad ${activeTab === "offers" ? "active" : ""}`}
        >
          Offers
        </button>
        {showExclusiveOffers && (
          <button
            onClick={() => handleTabClick("exclusive_offers")}
            className={`small-pad ${
              activeTab === "exclusive_offers" ? "active" : ""
            }`}
          >
            Exclusive Offers
          </button>
        )}
        <button
          onClick={() => handleTabClick("reviews")}
          className={`small-pad-2 ${activeTab === "reviews" ? "active" : ""}`}
        >
          Reviews
        </button>
      </div>
    </>
  );
};

Sellernav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  showExclusiveOffers: PropTypes.bool,
};

export default Sellernav;
