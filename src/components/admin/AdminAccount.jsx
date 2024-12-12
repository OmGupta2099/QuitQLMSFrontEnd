import React, { useEffect, useState } from "react";
import AdminService from "../../services/AdminService"; // Ensure you create an AdminService for admin-specific API calls
import { useAuth } from "../../context/useAuth";
import "../../css/MyAccount.css";
import ConfirmationModal from "../ConfirmationModal";
import logoutIcon from "../../images/logout.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AdminAccount() {
  const { auth, logout } = useAuth();

  const token = auth.token;
  const authemail = auth.email;
  const navigate = useNavigate();
  const [user_name, setUser_name] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_Number] = useState(0);
  const [email, setEmail] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [userRole, setUserRole] = useState("");

  // Edit state for each section
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const user_nameChange = (e) => setUser_name(e.target.value);
  const addressChange = (e) => setAddress(e.target.value);
  const phone_numberChange = (e) => setPhone_Number(e.target.value);
  const adminRoleChange = (e) => setAdminRole(e.target.value);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    console.log("get admin account use effect fired...");
    AdminService.getAdminByEmail(authemail, token).then((response) => {
      setUser_name(response.data.user_name);
      setAddress(response.data.address);
      setPhone_Number(response.data.phone_number);
      setAdminRole(response.data.adminRole);
      setUserRole(response.data.userRole);
      setEmail(response.data.email);
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
    console.log("update admin account use effect fired...");
    const updateObj = {
      user_name,
      address,
      phone_number,
      email,
      adminRole,
      userRole,
    };
    AdminService.updateAdmin(updateObj, email, token).then((response) => {
      console.log("Updated admin details successfully!!", response.data);
      setIsEditingName(false);
      setIsEditingPhone(false);
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
        <div className="menu-section">
          <h6>
            <b>Admin Role: </b>
            {adminRole}
          </h6>
        </div>
        <hr />
        <div className="logout-section" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
          <p className="mt-3">Logout</p>
        </div>
      </div>

      {/* Right Section - Account Information Form */}
      <div className="addform">
        <br />
        {/* Personal Information Section */}
        <div className="row ">
          <div className="col-sm-10">
            <h5>Personal Information</h5>
          </div>
          <div className="col-sm-2 text-end">
            <a href="#" onClick={() => setIsEditingName(!isEditingName)}>
              Edit
            </a>
          </div>
        </div>
        <div className="row ">
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

        {/* Email Section */}
        <div className="row ">
          <div className="col-sm-10">
            <h6>Email Address</h6>
          </div>
        </div>
        <div className="row ">
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

        {/* Phone Number Section */}
        <div className="row ">
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
              type="number"
              className="form-control"
              id="phone_number"
              value={phone_number}
              onChange={phone_numberChange}
              readOnly={!isEditingPhone}
            />
          </div>
        </div>

        <br />

        {/* Admin Role Section */}
        <div className="row ">
          <div className="col-sm-10">
            <h6>Admin Role</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <select
              className="form-select"
              id="adminRole"
              value={adminRole}
              onChange={adminRoleChange}
            >
              <option value="superAdmin">Super Admin</option>
              <option value="manageCustomers">Manage Customers</option>
              <option value="manageSellers">Manage Sellers</option>
              <option value="manageProducts">Manage Products</option>
            </select>
          </div>
        </div>

        <br />

        {/* User Role Section */}
        <div className="row ">
          <div className="col-sm-10">
            <h6>User Role</h6>
          </div>
        </div>
        <div className="row ">
          <div className="col-sm-12">
            <input
              type="text"
              className="form-control"
              id="userRole"
              value={userRole}
              readOnly
              disabled
            />
          </div>
        </div>

        <center>
          <button
            type="button"
            className="btn btn-primary savebtn mt-3"
            onClick={updateSave}
          >
            Save
          </button>
        </center>
      </div>
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
