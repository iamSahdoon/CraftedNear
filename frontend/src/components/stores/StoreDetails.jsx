import "./StoreDetails.css";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import PropTypes from "prop-types";
import mail_button from "../../assets/svgs/mail_btn.png";
import heart from "../../assets/svgs/heart.svg";

const StoreDetails = ({
  storeName,
  storeDescription,
  storeEmail,
  storeAddress,
  storePhone,
  sellerId,
  storeAvatar,
}) => {
  const { addFavoriteStore, customer, updateCustomerPoints } =
    useContext(StoreContext);

  const handleFavoriteClick = async () => {
    const result = await addFavoriteStore({
      sellerId,
      storeName,
      storeAvatar,
    });

    if (result.success) {
      if (customer) {
        await updateCustomerPoints(10);
      }
      alert("Store added to favorites!");
    }
  };

  const handleEmailClick = async () => {
    // If customer is logged in, award points
    if (customer) {
      await updateCustomerPoints(10);
    }
  };

  return (
    <div className="store-details">
      <div className="store-info-wrapper">
        <div className="store-des-wrapper">
          <div className="store-name-svg-wrapper">
            <p className="store_name">{storeName}</p>
            <a
              href={`mailto:${storeEmail}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleEmailClick}
            >
              <img src={mail_button} alt="mail" />
            </a>
          </div>
          <button className="heart-btn" onClick={handleFavoriteClick}>
            <img className="heart" src={heart} alt="fav" />
          </button>
        </div>
        <p className="store-des">{storeDescription}</p>
        <div className="store-contact-wrapper">
          <p>Tel : {storePhone}</p>
          <p>Address : {storeAddress}</p>
        </div>
      </div>
    </div>
  );
};

StoreDetails.propTypes = {
  storeName: PropTypes.string,
  storeDescription: PropTypes.string,
  storeEmail: PropTypes.string,
  storeAddress: PropTypes.string,
  storePhone: PropTypes.string,
  sellerId: PropTypes.string,
  storeAvatar: PropTypes.string,
};

export default StoreDetails;
