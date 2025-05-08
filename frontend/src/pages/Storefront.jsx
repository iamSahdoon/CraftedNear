import "./CSS/Storefront.css";

import Navbar1 from "../components/navbar/Navbar1";
import HeroSection from "../components/hero-text/HeroSection";

import Store from "../components/stores/Store";
import Footer from "../components/footer/Footer";

import { Link } from "react-router-dom";
import { Filter } from "../components/Filters/Filter";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import default_store_img from "../assets/images/store.png";

const Storefront = () => {
  const { sellers, fetchSellers } = useContext(StoreContext);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [filters, setFilters] = useState({ city: "", category: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    if (sellers) {
      applyFilters();
    }
  }, [sellers, filters, searchTerm]);

  const applyFilters = () => {
    let filtered = [...sellers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((seller) =>
        seller.store?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply city filter (case-insensitive)
    if (filters.city) {
      filtered = filtered.filter(
        (seller) => seller.city.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // Apply category filter (case-insensitive)
    if (filters.category) {
      filtered = filtered.filter(
        (seller) =>
          seller.store_category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    setFilteredSellers(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <div className="stores-container">
        <Navbar1 />
        <HeroSection herotext={"STOREFRONTS"} />
        <Filter onSearch={handleSearch} onFilter={handleFilter} />
        <div className="stores link">
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
            <p>No stores found</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Storefront;
