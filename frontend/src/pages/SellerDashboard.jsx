import "./CSS/SellerDashboard.css";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import SellerdashboardNav from "../components/navbar/SellerdashboardNav";
import HerotextSeller from "../components/hero-text/HerotextSeller";
import Footer from "../components/footer/Footer";
import DashboardNav from "../components/dashboard/DashboardNav";
import StoreDashboardContent from "../components/dashboard/StoreDashboardContent";
import GalleryDashboardContent from "../components/dashboard/GalleryDashboardContent";
import OfferDashboardContent from "../components/dashboard/OfferDashboardContent";
import ExclusiveOfferDashboardContent from "../components/dashboard/ExclusiveOfferDashboardContent";
import ReviewsDashboardContent from "../components/dashboard/ReviewsDashboardContent";
import LeaderboardDashboardContent from "../components/dashboard/LeaderboardDashboardContent";

const SellerDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("store");

  useEffect(() => {
    const storedSeller = localStorage.getItem("seller");
    const token = localStorage.getItem("token");

    if (!storedSeller || !token) {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "store":
        return <StoreDashboardContent />;
      case "gallery":
        return <GalleryDashboardContent />;
      case "offer":
        return <OfferDashboardContent />;
      case "exclusive_offer":
        return <ExclusiveOfferDashboardContent />;
      case "reviews":
        return <ReviewsDashboardContent />;
      case "leaderboard":
        return <LeaderboardDashboardContent />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="seller-dahsboard-container">
        <SellerdashboardNav />
        <HerotextSeller />
        <div className="dashboard-container">
          <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderContent()}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SellerDashboard;
