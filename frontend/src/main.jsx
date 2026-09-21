import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Storefront from "./pages/Storefront";
import About from "./pages/About";
import Offer from "./pages/Offer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SellerProfile_gallery from "./pages/SellerProfile_gallery";
import CustomerProfile from "./pages/CustomerProfile";
import StoreContextProvider from "./context/StoreContextProvider";
import SellerDashboard from "./pages/SellerDashboard";
import PageTransition from "./components/page-transition/PageTransition";

const router = createBrowserRouter([
  {
    // Layout route: animates each page in as you navigate
    element: <PageTransition />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/stores",
        element: <Storefront />,
      },
      {
        path: "/aboutus",
        element: <About />,
      },
      {
        path: "/offers",
        element: <Offer />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/seller/gallery",
        element: <SellerProfile_gallery />,
      },
      {
        path: "/customer/profile",
        element: <CustomerProfile />,
      },
      {
        path: "/seller/dashboard",
        element: <SellerDashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <StoreContextProvider>
      <div className="app-bg">
        <RouterProvider router={router} />
      </div>
    </StoreContextProvider>
  </>
);
