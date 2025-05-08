import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { StoreContext } from "../../context/StoreContext";
import search_icon from "../../assets/svgs/search.svg";
import "./Filter.css";

export const Filter = ({ onSearch, onFilter, type = "storefront" }) => {
  const { sellers, allSellerOffers, customer, updateCustomerPoints } =
    useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get unique cities and categories based on the type
  const getCitiesAndCategories = () => {
    let dataSource =
      type === "storefront"
        ? sellers
        : allSellerOffers.map((offer) => offer.seller);

    const cities = [
      ...new Set(dataSource.map((item) => item.city.toLowerCase())),
    ]
      .sort()
      .map((city) => city.charAt(0).toUpperCase() + city.slice(1));

    const categories = [
      ...new Set(dataSource.map((item) => item.store_category.toLowerCase())),
    ]
      .sort()
      .map((category) => category.charAt(0).toUpperCase() + category.slice(1));

    return { cities, categories };
  };

  const { cities, categories } = getCitiesAndCategories();

  const handleSearch = () => {
    onSearch(searchTerm);
    // Update points if customer is logged in
    if (customer) {
      updateCustomerPoints(4);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "city") {
      setSelectedCity(value);
    } else if (name === "category") {
      setSelectedCategory(value);
    }

    onFilter({
      city: name === "city" ? value : selectedCity,
      category: name === "category" ? value : selectedCategory,
    });

    // Update points if customer is logged in
    if (customer) {
      updateCustomerPoints(4);
    }
  };

  return (
    <>
      <div className="search-container">
        <div className="sort-wrapper">
          <p>Sort by:</p>
          <div className="dropdown-wrapper">
            <select
              className="city-dropdown"
              name="city"
              value={selectedCity}
              onChange={handleFilterChange}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city.toLowerCase()}>
                  {city}
                </option>
              ))}
            </select>
            <select
              className="category-dropdown"
              name="category"
              value={selectedCategory}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="search-wrapper">
          <p>Search by:</p>
          <div className="searchbar-wrapper">
            <input
              type="text"
              className="searchbar"
              placeholder={
                type === "storefront" ? "Search stores..." : "Search offers..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-icon" onClick={handleSearch}>
              <img src={search_icon} alt="search-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

Filter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["storefront", "offers"]),
};
