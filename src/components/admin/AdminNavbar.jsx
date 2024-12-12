import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "react-bootstrap";
import "../../css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/Logo1.png";
import login from "../../images/login.png";
import { useState } from "react";

function AdminNavbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="navbar navbar-light custom-navbar"
      style={{ backgroundColor: "#46A1E9" }}
      data-mdb-theme="light"
    >
      <div className="container-fluid d-flex justify-content-between align-items-center leftnav">
        {/* Left: Logo */}
        <div className="d-flex align-items-center">
          <Nav.Link className="title" as={Link} to={`/admin`}>
            <img src={logo} alt="logo" width="100" height="40" />
          </Nav.Link>
        </div>

        {/* Right: Login, Cart, Become Seller */}
        <div className="d-flex align-items-center rightnav">
          <div className="nav-item d-flex align-items-center me-4">
            <img src={login} alt="Login" width="24" height="24" />
            <Link className="rightitem" to="/admin/account/">
              My Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
