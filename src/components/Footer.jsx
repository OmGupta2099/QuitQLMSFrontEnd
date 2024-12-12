import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import logo from "../images/Logo1.png";
import "../css/Footer.css";

function Footer() {
  const [showModal, setShowModal] = useState(null);

  const handleClose = () => setShowModal(null);
  const handleShow = (modal) => setShowModal(modal);

  return (
    <footer className="footer text-white">
      <div className="container-fluid d-flex justify-content-between align-items-center py-2">
        {/* Left: Logo */}
        <div className="d-flex align-items-center">
          <img src={logo} alt="QuitQ Logo" width="100" height="40" />
        </div>

        {/* Center: Links */}
        <div className="d-flex justify-content-center">
          <Nav className="me-auto">
            <Nav.Link
              as="span"
              onClick={() => handleShow("about")}
              className="text-white"
            >
              About Us
            </Nav.Link>
            <Nav.Link
              as="span"
              onClick={() => handleShow("contact")}
              className="text-white"
            >
              Contact
            </Nav.Link>
            <Nav.Link
              as="span"
              onClick={() => handleShow("privacy")}
              className="text-white"
            >
              Privacy Policy
            </Nav.Link>
            <Nav.Link
              as="span"
              onClick={() => handleShow("terms")}
              className="text-white"
            >
              Terms of Service
            </Nav.Link>
          </Nav>
        </div>

        {/* Right: Social Media Links */}
        <div className="d-flex align-items-center">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white me-2"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white me-2"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="text-center py-2">
        <small>
          &copy; {new Date().getFullYear()} QuitQ. All Rights Reserved.
        </small>
      </div>

      {/* Modals */}
      {/* About Us Modal */}
      <Modal show={showModal === "about"} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>About QuitQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            QuitQ is a leading e-commerce platform, dedicated to bringing you a
            seamless shopping experience with a wide range of products and
            exceptional service. We strive to make online shopping easy,
            enjoyable, and accessible for everyone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contact Modal */}
      <Modal show={showModal === "contact"} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Have questions or need assistance? We're here to help! Reach out to
            us at <a href="mailto:support@quitq.com">support@quitq.com</a> or
            call us at (123) 456-7890. Our customer service team is available
            24/7 to ensure your satisfaction.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal show={showModal === "privacy"} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            At QuitQ, we value your privacy. Our privacy policy outlines how we
            collect, use, and protect your personal data to provide you with a
            secure shopping experience. For detailed information, please visit
            our{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            page.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal show={showModal === "terms"} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Terms of Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            By accessing QuitQ, you agree to our Terms of Service. These terms
            govern your use of our platform and outline your rights and
            responsibilities. Please read them carefully. For more details,
            please visit our{" "}
            <a
              href="/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{" "}
            page.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </footer>
  );
}

export default Footer;
