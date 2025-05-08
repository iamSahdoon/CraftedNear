import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Store.css";
import PropTypes from "prop-types";

const Store = ({ storename, storeimg, sellerId }) => {
  const { customer, updateCustomerPoints, updateSellerProfileVisit } =
    useContext(StoreContext);

  const handleStoreClick = async () => {
    // Update seller's profile visit count (for all users)
    if (sellerId) {
      await updateSellerProfileVisit(sellerId);
    }

    // Update customer points (only for logged-in customers)
    if (customer) {
      await updateCustomerPoints(5);
    }
  };

  return (
    <>
      <div className="store-wrapper" onClick={handleStoreClick}>
        <img src={storeimg} alt="store" />
        <p>{storename}</p>
      </div>
    </>
  );
};

Store.propTypes = {
  storename: PropTypes.string.isRequired,
  storeimg: PropTypes.string.isRequired,
  sellerId: PropTypes.string,
};

export default Store;
