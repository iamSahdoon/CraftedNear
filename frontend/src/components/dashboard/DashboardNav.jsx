import "./DashboardNav.css";
import PropTypes from "prop-types";

const DashboardNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "store", label: "Store" },
    { id: "gallery", label: "Gallery" },
    { id: "offer", label: "Offer" },
    { id: "exclusive_offer", label: "Exclusive Offer" },
    { id: "reviews", label: "Reviews" },
    { id: "leaderboard", label: "Leaderboard" },
  ];

  return (
    <>
      <div className="dashboard-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
};

DashboardNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default DashboardNav;
