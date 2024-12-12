import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthProvider"; // Import context
import NavbarComponent from "./components/NavbarComponent";
import Home from "./components/Home";
import Product from "./components/Product";
import SearchPage from "./components/SearchPage";
import { Login } from "./components/Login";
import { CustomerRegistration } from "./components/customer/CustomerRegistration";
import { SellerRegistration } from "./components/seller/SellerRegistration";
import { Error } from "./components/Error";
import CustomerNavbar from "./components/customer/CustomerNavbar";
import MyAccount from "./components/customer/MyAccount";
import Cart from "./components/customer/Cart";
import AdminPanel from "./components/admin/AdminPanel";
import Manage from "./components/admin/Manage";
import AdminNavbar from "./components/admin/AdminNavbar";
import AdminAccount from "./components/admin/AdminAccount";
import CartPayments from "./components/customer/CartPayments";
import BuyNowPayment from "./components/customer/BuyNowPayment";
import Orders from "./components/customer/Orders";
import SellerHome from "./components/seller/SellerHome";
import SellerNavbar from "./components/seller/SellerNavbar";
import SellerProduct from "./components/seller/SellerProduct";
import SellerAccount from "./components/seller/SellerAccount";
import SellerOrders from "./components/seller/SellerOrders";
import Footer from "./components/Footer";

function App() {
  // Get auth state from the AuthContext
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    console.log("Auth context updated:", auth);
  }, [auth]);

  const NavigationBar = ({ auth }) => {
    if (auth?.token) {
      // User is authenticated
      if (auth.userRole === "Customer") {
        return <CustomerNavbar />;
      } else if (auth.userRole === "Admin") {
        return <AdminNavbar />;
      } else if (auth.userRole === "Seller") {
        return <SellerNavbar />;
      }
    }
    return <NavbarComponent />;
  };

  return (
    <div>
      {/* Conditionally render Navbar based on authentication */}
      {/* {auth?.token ? <CustomerNavbar /> : <NavbarComponent />} */}
      <NavigationBar auth={auth} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quitq-home" element={<Home />} />
        <Route path="/quitq/:product_name/:product_id" element={<Product />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Authentication and Registration Routes */}

        <Route path="/login" element={<Login />} />
        <Route path="/customer/register" element={<CustomerRegistration />} />
        <Route path="/seller/register" element={<SellerRegistration />} />

        {/*Customer Routs*/}
        <Route path="/customer" element={<Home />} />
        <Route path="/customer/search" element={<SearchPage />} />
        <Route
          path="/customer/:product_name/:product_id"
          element={<Product />}
        />
        <Route path="/customer/account/" element={<MyAccount />} />
        <Route path="/customer/cart" element={<Cart />} />
        <Route path="/customer/cart/payment" element={<CartPayments />} />
        <Route path="/customer/buynow/:productId" element={<BuyNowPayment />} />
        <Route path="/customer/orders" element={<Orders />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/manage" element={<Manage />} />
        <Route path="/admin/account" element={<AdminAccount />} />

        {/* Seller Routes */}
        <Route path="/seller" element={<SellerHome />} />
        <Route
          path="/seller/:product_name/:product_id"
          element={<SellerProduct />}
        />
        <Route path="/seller/newproduct" element={<SellerProduct />} />
        <Route path="/seller/account" element={<SellerAccount />} />
        <Route path="/seller/orders" element={<SellerOrders />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
