import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CSS/SellerProfile.css";
import Navbar1 from "../components/navbar/Navbar1";
import profile_img from "../assets/images/narmatha.png";
import product from "../assets/images/product.png";
import Footer from "../components/footer/Footer";
import Sellernav from "../components/navbar/Sellernav";
import Map from "../components/map/Map";
import StoreDetails from "../components/stores/StoreDetails";
import GalleryProduct from "../components/products/GalleryProduct";
import OfferProduct from "../components/products/OfferProduct";
import ReviewSection from "../components/stores/ReviewSection";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

const SellerProfile_gallery = () => {
  const location = useLocation();
  const sellerData = location.state?.sellerData;
  const [activeTab, setActiveTab] = useState("gallery");
  const {
    galleryItems,
    fetchGalleryItems,
    offers,
    fetchOffers,
    exclusiveOffers,
    fetchExclusiveOffers,
    customer,
  } = useContext(StoreContext);

  useEffect(() => {
    if (sellerData?._id) {
      fetchGalleryItems(sellerData._id);
      fetchOffers(sellerData._id);
      if (customer) {
        fetchExclusiveOffers(sellerData._id);
      }
    }
  }, [
    sellerData,
    fetchGalleryItems,
    fetchOffers,
    fetchExclusiveOffers,
    customer,
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case "gallery":
        return (
          <div className="grid-products-profile">
            {galleryItems && galleryItems.length > 0 ? (
              galleryItems.map((item) => (
                <GalleryProduct
                  key={item._id}
                  g_product_img={item.image || product}
                  description={item.product_description}
                  price={item.price ? `Rs. ${item.price}` : ""}
                />
              ))
            ) : (
              <p>No gallery items found</p>
            )}
          </div>
        );
      case "offers":
        return (
          <div className="grid-products-profile">
            {offers && offers.length > 0 ? (
              offers.map((offer) => (
                <OfferProduct
                  key={offer._id}
                  o_product_img={offer.image || product}
                  description={offer.product_description}
                  old_price={`Rs. ${offer.old_price}`}
                  new_price={`Rs. ${offer.new_price}`}
                  points={""}
                />
              ))
            ) : (
              <p>No offers available</p>
            )}
          </div>
        );
      case "exclusive_offers":
        if (!customer) {
          return (
            <div className="login-prompt">
              <p>Please login to view exclusive offers</p>
            </div>
          );
        }
        return (
          <div className="grid-products-profile">
            {exclusiveOffers && exclusiveOffers.length > 0 ? (
              exclusiveOffers.map((offer) => (
                <OfferProduct
                  key={offer._id}
                  o_product_img={offer.image}
                  description={offer.product_description}
                  old_price={`Rs. ${offer.old_price}`}
                  new_price={`Rs. ${offer.new_price}`}
                  points={`Required Points: ${offer.customer_point_threshold}`}
                />
              ))
            ) : (
              <p>No exclusive offers available</p>
            )}
          </div>
        );
      case "reviews":
        return <ReviewSection />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="profile-container">
        <Navbar1 />
        <Map />
        <div className="profile-img-des-wrapper">
          <div className="map-wrapper">
            <img
              src={sellerData?.store?.avatar || profile_img}
              alt="profile_img"
            />
          </div>
          <StoreDetails
            storeName={sellerData?.store?.name}
            storeDescription={sellerData?.store?.store_description}
            storeEmail={sellerData?.email}
            storeAddress={sellerData?.location}
            storePhone={sellerData?.tel}
            sellerId={sellerData?._id}
            storeAvatar={sellerData?.store?.avatar}
          />
        </div>
        <Sellernav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showExclusiveOffers={!!customer}
        />
        {renderContent()}
        <Footer />
      </div>
    </>
  );
};

export default SellerProfile_gallery;
