import "./GalleryProduct.css";
import PropTypes from "prop-types";

const GalleryProduct = ({ g_product_img, description, price }) => {
  return (
    <>
      <div className="gallery-product">
        <img src={g_product_img} alt="" />
        <div className="g-product-desc">
          <p>{description}</p>
          <p>{price}</p>
        </div>
      </div>
    </>
  );
};

GalleryProduct.propTypes = {
  g_product_img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};

export default GalleryProduct;
