import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal";
import logo from "../../images/Logo1.png";
import search from "../../images/search.png";
import login from "../../images/login.png";
import orders from "../../images/orders.png";
import shop from "../../images/shop.png";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function SellerNavbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { auth, logout } = useAuth();
  const handleHomePageClick = (e) => {
    e.preventDefault();
    setShowModal(true); // Show the modal
  };

  const handleConfirm = () => {
    setShowModal(false);
    logout();
    navigate("/");
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
            <Nav.Link className="title" as={Link} to={`/seller`}>
              <img src={logo} alt="logo" width="100" height="40" />
            </Nav.Link>
          </div>

          {/* Right: My Account, Orders, Add Product, QuitQ Home */}
          <div className="d-flex align-items-center rightnav">
            <div className="nav-item d-flex align-items-center me-4">
              <img src={login} alt="Login" width="24" height="24" />
              <Link className="rightitem" to="/seller/account/">
                My Account
              </Link>
            </div>

            <div className="nav-item d-flex align-items-center me-4">
              <img src={orders} alt="Orders" width="24" height="24" />
              <Link className="rightitem" to="/seller/orders">
                Orders
              </Link>
            </div>

            {/* New "Add Product" link */}
            <div className="nav-item d-flex align-items-center me-4">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <Link className="rightitem" to="/seller/newproduct">
                Add Product
              </Link>
            </div>

            <div className="nav-item d-flex align-items-center me-4">
              <img src={shop} alt="home page" width="24" height="24" />
              <a className="rightitem" href="/" onClick={handleHomePageClick}>
                QuitQ Home Page
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
        message="Navigating to QuitQ Home page will log off you as Seller. Would you like to proceed?"
      />
    </>
  );
}

export default SellerNavbar;
