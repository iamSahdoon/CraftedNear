import "./OfferProduct.css";
import PropTypes from "prop-types";

const OfferProduct = ({
  o_product_img,
  description,
  old_price,
  new_price,
  points,
}) => {
  return (
    <>
      <div className="offers-product">
        <img src={o_product_img} alt="" />
        <p className="o-desc">{description}</p>
        <div className="o-product-desc">
          <p className="o-old-price">{old_price}</p>
          <p>{new_price}</p>
        </div>
        <p className="o-points">{points}</p>
      </div>
    </>
  );
};

OfferProduct.propTypes = {
  o_product_img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  old_price: PropTypes.string.isRequired,
  new_price: PropTypes.string.isRequired,
  points: PropTypes.string,
};

export default OfferProduct;
