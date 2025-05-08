import "./Category.css";

import bakery from "../../assets/categories/bakery.svg";
import clothing from "../../assets/categories/clothing.svg";
import crafts from "../../assets/categories/crafts.svg";
import multistore from "../../assets/categories/multistore.svg";
import rental from "../../assets/categories/rental.svg";

import { Link } from "react-router-dom";

const Category = () => {
  return (
    <div className="category">
      <Link to="/stores">
        <img src={bakery} alt="bakery" />
      </Link>
      <Link to="/stores">
        <img src={clothing} alt="clothing" />
      </Link>
      <Link to="/stores">
        <img src={crafts} alt="crafts" />
      </Link>
      <Link to="/stores">
        <img src={multistore} alt="multistore" />
      </Link>
      <Link to="/stores">
        <img src={rental} alt="rental" />
      </Link>
    </div>
    // change using props
  );
};

export default Category;
