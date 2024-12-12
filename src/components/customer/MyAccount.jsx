import React, { useEffect, useState } from "react";
import CustomerService from "../../services/CustomerService";
import { useAuth } from "../../context/useAuth";
import ConfirmationModal from "../ConfirmationModal";
import "../../css/MyAccount.css";
import logoutIcon from "../../images/logout.png";
import couponIcon from "../../images/coupon.png";
import profileIcon from "../../images/login.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid2 as MuiGrid,
} from "@mui/material";
import CouponsCard from "../../utils/CouponsCard"; // Ensure you import this component

export default function MyAccount() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const token = auth.token;
  const authemail = auth.email;

  const [user_name, setUser_name] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_Number] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [userCoupons, setUserCoupons] = useState([]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const user_nameChange = (e) => setUser_name(e.target.value);
  const addressChange = (e) => setAddress(e.target.value);
  const phone_numberChange = (e) => setPhone_Number(e.target.value);
  const paymentModeChange = (e) => setPaymentMode(e.target.value);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showCoupons, setShowCoupons] = useState(false);

  useEffect(() => {
    console.log("get account use effect fired...");
    loadCoupons(authemail, token);
    CustomerService.getCustomerByEmail(authemail, token).then((response) => {
      setUser_name(response.data.user_name);
      setAddress(response.data.address);
      setPhone_Number(response.data.phone_number);
      setPaymentMode(response.data.paymentMode);
      setEmail(response.data.email);
    });
  }, [authemail, token]);

  const loadCoupons = async (authemail, token) => {
    try {
      const response = await CustomerService.getCouponsByEmail(authemail, token);
      setUserCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const updateSave = () => {
    if (!validatePhoneNumber(phone_number)) {
      toast.error("Phone number must be exactly 10 digits."); // Show error message
      return;
    }
    setShowSaveModal(true); // Show save confirmation modal
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/; // Corrected regex for exactly 10 digits
    return phoneRegex.test(phone);
  };

  const confirmSave = () => {
    console.log("update account use effect fired...");
    const updateObj = { user_name, address, phone_number, email, paymentMode };
    CustomerService.updateCustomer(updateObj, email, token).then((response) => {
      console.log("Updated user details successfully!!", response.data);
      setIsEditingName(false);
      setIsEditingPhone(false);
      setShowSaveModal(false);
    });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleCoupons = () => {
    setShowCoupons(true);
    setShowProfile(false);
  };

  const handleProfile = () => {
    setShowProfile(true);
    setShowCoupons(false);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutModal(false);
  };

  return (
    <div className="my-account-container">
      <ToastContainer />
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
        <div className="profile-section" onClick={handleProfile}>
          <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
          <p className="mt-3">My Profile</p>
        </div>
        <hr />
        <div className="user-coupons-section" onClick={handleCoupons}>
          <img src={couponIcon} alt="Coupon Icon" className="coupons-icon" />
          <p className="mt-3">My Coupons</p>
        </div>
        <hr />
        <div className="logout-section" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
          <p className="mt-3">Logout</p>
        </div>
        <hr />
      </div>

      <div className="addform">
        <br />
        {showProfile && (
          <>
            <div className="row mb-3">
              <div className="col-sm-10">
                <h5>Personal Information</h5>
              </div>
              <div className="col-sm-2 text-end">
                <a href="#" onClick={() => setIsEditingName(!isEditingName)}>
                  Edit
                </a>
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
                  onChange={user_nameChange}
                  readOnly={!isEditingName}
                />
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
                  onChange={addressChange}
                  readOnly={!isEditingName}
                />
              </div>
            </div>

            <br />

            <div className="row mb-3">
              <div className="col-sm-10">
                <h6>Email Address</h6>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-12">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  disabled
                />
              </div>
            </div>

            <br />

            <div className="row mb-3">
              <div className="col-sm-10">
                <h6>Mobile Number</h6>
              </div>
              <div className="col-sm-2 text-end">
                <a href="#" onClick={() => setIsEditingPhone(!isEditingPhone)}>
                  Edit
                </a>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-12">
                <input
                  type="text"
                  className="form-control"
                  id="phone_number"
                  value={phone_number}
                  onChange={phone_numberChange}
                  readOnly={!isEditingPhone}
                />
              </div>
            </div>

            <br />

            <div className="row mb-3">
              <div className="col-sm-10">
                <h6>Payment Mode</h6>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-12">
                <select
                  className="form-select"
                  id="paymentMode"
                  value={paymentMode}
                  onChange={paymentModeChange}
                >
                  <option>Choose...</option>
                  <option value="UPI">UPI</option>
                  <option value="NetBanking">NET BANKING</option>
                  <option value="CreditCard">CREDIT CARD</option>
                </select>
              </div>
            </div>

            <center>
              <button
                type="button"
                className="btn btn-primary savebtn"
                onClick={updateSave}
              >
                Save
              </button>
            </center>
          </>
        )}
        {showCoupons && (
          <><div className="row mb-3">
          <div className="col-sm-10">
            <h5>My Coupons</h5>
          </div>
          </div>
            {userCoupons.length > 0 ? (
              <MuiGrid container spacing={3}>
                {userCoupons.map((coupon) => (
                  <MuiGrid item xs={12} sm={6} md={4} key={coupon.couponCode}>
                    <CouponsCard
                      coupon={coupon}
                      color={"#FCE205"}
                    />
                  </MuiGrid>
                ))}
              </MuiGrid>
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ textAlign: "center", mt: 2 }}
              >
                No coupons available. Buy and get a new coupon!
              </Typography>
            )}
          </>
        )}
      </div>

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
