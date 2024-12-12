import React, { useEffect, useState } from "react";
import SellerService from "../../services/SellerService";
import { useAuth } from "../../context/useAuth";
import ConfirmationModal from "../ConfirmationModal";
import "../../css/MyAccount.css";
import logoutIcon from "../../images/logout.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function SellerAccount() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const token = auth.token;
  const authemail = auth.email;

  // State for seller details
  const [store_name, setStoreName] = useState("");
  const [account_number, setAccountNumber] = useState("");
  const [ifsc_code, setIfscCode] = useState("");
  const [gst_number, setGstNumber] = useState("");
  const [shippingMode, setShippingMode] = useState("");
  const [user_name, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  // Edit state for username and shipping mode
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingShippingMode, setIsEditingShippingMode] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  // Input change handlers
  const userNameChange = (e) => setUserName(e.target.value);
  const shippingModeChange = (e) => setShippingMode(e.target.value);
  const phoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    console.log("get seller use effect fired...");
    SellerService.getSellerByEmail(authemail, token).then((response) => {
      setStoreName(response.data.store_name);
      setAccountNumber(response.data.account_number);
      setIfscCode(response.data.ifsc_code);
      setGstNumber(response.data.gst_number);
      setShippingMode(response.data.shippingMode);
      setUserName(response.data.user_name);
      setAddress(response.data.address);
      setPhoneNumber(response.data.phone_number);
      setEmail(response.data.email);
      setUserRole(response.data.userRole);
    });
  }, [authemail, token]);
  const updateSave = () => {
    if (!validatePhoneNumber(phone_number)) {
      toast.error("Phone number must be exactly 10 digits."); // Show error message
      return;
    }
    setShowSaveModal(true); // Show save confirmation modal
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/; // Regex for exactly 10 digits
    return phoneRegex.test(phone);
  };
  const confirmSave = () => {
    console.log("update seller use effect fired...");
    const updateObj = {
      user_name,
      shippingMode,
      store_name,
      account_number,
      ifsc_code,
      gst_number,
      address,
      phone_number,
      email,
      userRole,
    };

    // Call updateSeller with only the fields that can be updated
    SellerService.updateSeller(updateObj, email, token).then((response) => {
      console.log("Updated seller details successfully!!", response.data);
      // alert("Account details updated successfully");
      setIsEditingName(false);
      setIsEditingShippingMode(false);
      setShowSaveModal(false);
    });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  const confirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutModal(false);
  };

  return (
    <div className="my-account-container">
      <ToastContainer />
      {/* Left Section - Sidebar */}
      <div className="sidebar">
        <div className="hello-section">
          <img
            src="https://media.istockphoto.com/id/1957053641/vector/cute-kawaii-robot-character-friendly-chat-bot-assistant-for-online-applications-cartoon.jpg?s=612x612&w=0&k=20&c=Uf7lcu3I_ZNQvjBWxlFenRX7FuG_PKVJ4y1Y11aTZUc="
            alt="hello img"
            className="hello-img"
          />
          <h4>Hello, {user_name}</h4>
        </div>
        <hr />
        <div className="logout-section" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
          <p className="mt-3">Logout</p>
        </div>
        <hr />
      </div>
      {/* Right Section - Account Information Form */}
      <div className="addform">
        <br />
        {/* Store Information Section */}
        <div className="row mb-3">
          <div className="col-sm-10">
            <h5>Store Information</h5>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="store_name" className="col-form-label">
              Store Name
            </label>
            <input
              type="text"
              className="form-control"
              id="store_name"
              value={store_name}
              readOnly
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="account_number" className="col-form-label">
              Account Number
            </label>
            <input
              type="text"
              className="form-control"
              id="account_number"
              value={account_number}
              readOnly
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="ifsc_code" className="col-form-label">
              IFSC Code
            </label>
            <input
              type="text"
              className="form-control"
              id="ifsc_code"
              value={ifsc_code}
              readOnly
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="gst_number" className="col-form-label">
              GST Number
            </label>
            <input
              type="text"
              className="form-control"
              id="gst_number"
              value={gst_number}
              readOnly
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="shippingMode" className="col-form-label">
              Shipping Mode
            </label>
            <select
              className="form-select"
              id="shippingMode"
              value={shippingMode}
              onChange={shippingModeChange}
              disabled={!isEditingShippingMode}
            >
              <option value="Flipkart_Fulfillment">Flipkart Fulfillment</option>
              <option value="Self_Ship_Fulfillment">
                Self Ship Fulfillment
              </option>
            </select>
            <a
              href="#"
              onClick={() => setIsEditingShippingMode(!isEditingShippingMode)}
              className="edit-link"
            >
              Edit
            </a>
          </div>
        </div>

        <br />

        {/* Personal Information Section */}
        <div className="row mb-3">
          <div className="col-sm-10">
            <h5>Personal Information</h5>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="user_name" className="col-form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="user_name"
              value={user_name}
              onChange={userNameChange}
              readOnly={!isEditingName}
            />
            <a
              href="#"
              onClick={() => setIsEditingName(!isEditingName)}
              className="edit-link"
            >
              Edit
            </a>
          </div>
          <div className="col-sm-6">
            <label htmlFor="address" className="col-form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              value={address}
              readOnly
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="phone_number" className="col-form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="phone_number"
              value={phone_number}
              onChange={phoneNumberChange}
              readOnly={!isEditingPhone}
            />
            <a
              href="#"
              onClick={() => setIsEditingPhone(!isEditingPhone)}
              className="edit-link"
            >
              Edit
            </a>
          </div>
          <div className="col-sm-6">
            <label htmlFor="email" className="col-form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              readOnly
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="row mb-3">
          <div className="col-sm-12 text-end">
            <button className="btn btn-success" onClick={updateSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Confirmation modals */}
      <ConfirmationModal
        show={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        message="Are you sure you want to log out?"
      />
      <ConfirmationModal
        show={showSaveModal}
        onConfirm={confirmSave}
        onCancel={() => setShowSaveModal(false)}
        message="Are you sure you want to save changes?"
      />
    </div>
  );
}
