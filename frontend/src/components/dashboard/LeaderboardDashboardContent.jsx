import { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./LeaderboardDashboardContent.css"; // We'll create this CSS file

const LeaderboardDashboardContent = () => {
  const { customersLeaderboard, fetchCustomersLeaderboard } =
    useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchCustomersLeaderboard().finally(() => setIsLoading(false));
  }, [fetchCustomersLeaderboard]);

  return (
    <div className="leaderboard-dashboard-content">
      <p className="leaderboard-description">
        Top customers based on accumulated points. Use this insight for setting
        exclusive offer thresholds.
      </p>
      {isLoading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Location</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {customersLeaderboard && customersLeaderboard.length > 0 ? (
              customersLeaderboard.map((customer, index) => (
                <tr key={customer._id || index}>
                  {" "}
                  {/* Use _id if available */}
                  <td>{index + 1}</td>
                  <td>{`Anonymous Customer ${index + 1}`}</td>{" "}
                  {/* Anonymize Name */}
                  <td>{customer.location}</td>
                  <td>{customer.points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No customer data available for leaderboard.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderboardDashboardContent;
