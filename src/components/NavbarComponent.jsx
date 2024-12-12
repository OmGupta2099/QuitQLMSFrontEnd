import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "react-bootstrap";
import "../css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import logo from "../images/Logo1.png";
import search from "../images/search.png";
import login from "../images/login.png";
import register from "../images/reg.png";
import cart from "../images/cart.png";
import shop from "../images/shop.png";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

function NavbarComponent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { auth } = useAuth();
  const token = auth.token;

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
    } else {
      alert("Enter product name or brand name to search");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Call handleSearch when Enter is pressed
    }
  };
  const handleCartClick = (event) => {
    event.preventDefault();
    if (!token) {
      setShowModal(true);
    } else {
      navigate("/cart");
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate("/login"); // redirect to login if confirmed
  };

  const handleCancel = () => {
    setShowModal(false); // just close the modal
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
              <a className="rightitem" href="/login">
                Login
              </a>
            </div>

            <div className="nav-item d-flex align-items-center me-4">
              <img src={register} alt="register" width="24" height="24" />
              <a className="rightitem" href="/customer/register">
                Register
              </a>
            </div>

            <div className="nav-item d-flex align-items-center me-4">
              <img
                src={cart}
                alt="Cart"
                width="24"
                height="24"
                onClick={handleCartClick}
              />
              <a className="rightitem" href="/login" onClick={handleCartClick}>
                Cart
              </a>
            </div>

            <div className="nav-item d-flex align-items-center me-4">
              <img src={shop} alt="Become a Seller" width="24" height="24" />
              <a className="rightitem" href="/login">
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
        message="You need to be logged in to access the cart. Would you like to log in?"
      />
    </>
  );
}

export default NavbarComponent;
