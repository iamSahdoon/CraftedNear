import { useEffect, useState } from "react";
import "./CSS/Storefront.css";
import Navbar1 from "../components/navbar/Navbar1";
import HeroSection from "../components/hero-text/HeroSection";
import Footer from "../components/footer/Footer";
import { Filter } from "../components/Filters/Filter";
import OfferProduct from "../components/products/OfferProduct";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Offer = () => {
  const {
    allSellerOffers,
    fetchAllSellerOffers,
    updateSellerProfileVisit,
    customer,
    updateCustomerPoints,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [filters, setFilters] = useState({ city: "", category: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllSellerOffers();
  }, [fetchAllSellerOffers]);

  useEffect(() => {
    if (allSellerOffers) {
      applyFilters();
    }
  }, [allSellerOffers, filters, searchTerm]);

  const applyFilters = () => {
    let filtered = [...allSellerOffers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((offer) =>
        offer.seller.storeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter(
        (offer) =>
          offer.seller.city.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (offer) =>
          offer.seller.store_category.toLowerCase() ===
          filters.category.toLowerCase()
      );
    }

    setFilteredOffers(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSellerClick = async (seller) => {
    // Update profile visit count
    if (seller._id) {
      await updateSellerProfileVisit(seller._id);
    }
    if (customer) {
      updateCustomerPoints(5);
    }

    // Navigate to seller gallery
    navigate(`/seller/gallery`, {
      state: {
        sellerData: {
          _id: seller._id,
          name: seller.name,
          email: seller.email,
          tel: seller.tel,
          city: seller.city,
          location: seller.location,
          store_category: seller.store_category,
          store: {
            name: seller.storeName,
            avatar: seller.storeAvatar,
            store_description: seller.storeDescription,
          },
        },
      },
    });
  };

  return (
    <>
      <div className="stores-container">
        <Navbar1 />
        <HeroSection herotext={"OFFERS"} />
        <Filter onSearch={handleSearch} onFilter={handleFilter} type="offers" />
        <br />
        <div className="grid-products-profile-offers">
          {filteredOffers && filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <div key={offer._id} className="offer-item">
                <button
                  className="offer-details"
                  onClick={() => handleSellerClick(offer.seller)}
                >
                  <p className="store-name">{offer.seller.storeName}</p>
                  <p className="location">{offer.seller.city}</p>
                </button>
                <div className="offer-border">
                  <OfferProduct
                    o_product_img={offer.image}
                    description={offer.product_description}
                    old_price={`Rs. ${offer.old_price}`}
                    new_price={`Rs. ${offer.new_price}`}
                    points={""}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No offers available</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Offer;
