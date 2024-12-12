import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "../../css/Navbar.css";
import ConfirmationModal from "../ConfirmationModal";
import logo from "../../images/Logo1.png";
import search from "../../images/search.png";
import login from "../../images/login.png";
import orders from "../../images/orders.png";
import cart from "../../images/cart.png";
import shop from "../../images/shop.png";
import { useState } from "react";

function CustomerNavbar() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/customer/search?query=${searchQuery}`);
    } else {
      alert("Enter product name or brand name to search");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Call handleSearch when Enter is pressed
    }
  };
  const handleSellerPageClick = (e) => {
    e.preventDefault();
    setShowModal(true); // Show the modal
  };

  const handleConfirm = () => {
    setShowModal(false);
    logout();
    navigate("/login"); // Redirect to login page if confirmed
  };

  const handleCancel = () => {
    setShowModal(false); // Just close the modal
  };

  return (
    <>
      <nav
        className="navbar navbar-light custom-navbar"
        style={{ backgroundColor: "#46A1E9" }}
        data-mdb-theme="light"
      >
        <div className="container-fluid d-flex justify-content-between align-items-center leftnav">
          {/* Left: Logo */}
          <div className="d-flex align-items-center">
            <Nav.Link className="title" as={Link} to={`/quitq-home`}>
              <img src={logo} alt="logo" width="100" height="40" />
            </Nav.Link>
          </div>

          {/* Center: Search Bar */}
          <div className="search-container">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search for Products and Brands"
                aria-describedby="inputGroup-sizing-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn btn-yellow btn-sm"
                type="button"
                onClick={handleSearch}
              >
                <img
                  src={search}
                  alt="search"
                  className="_1XmrCc _2zJ7Pb"
                  width="20"
                  height="20"
                />
              </button>
            </div>
          </div>

          {/* Right: Login, Cart, Become Seller */}
          <div className="d-flex align-items-center rightnav">
            <div className="nav-item d-flex align-items-center me-4">
              <img src={login} alt="Login" width="24" height="24" />
              <Link className="rightitem" to="/customer/account/">
                My Account
              </Link>
            </div>

            <div className="nav-item d-flex align-items-center me-4">
              <img src={orders} alt="register" width="24" height="24" />
              <Link className="rightitem" to="/customer/orders">
                Orders
              </Link>
            </div>

            <div className="nav-item d-flex align-items-center me-4">
              <img src={cart} alt="Cart" width="24" height="24" />
              <Link className="rightitem" to="/customer/cart">
                Cart
              </Link>
            </div>

            <div className="nav-item d-flex align-items-center me-4">
              <img src={shop} alt="Become a Seller" width="24" height="24" />
              <a
                className="rightitem"
                href="/login"
                onClick={handleSellerPageClick}
              >
                Seller's Page
              </a>
            </div>
          </div>
        </div>
      </nav>
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="You need to be logged in to access the Seller's Page. This will log you off as a customer. Would you like to proceed?"
      />
    </>
  );
}

export default CustomerNavbar;
