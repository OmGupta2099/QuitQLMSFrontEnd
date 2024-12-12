import React, { useEffect, useState } from "react";
import "../../css/AdminPanel.css";
import { useNavigate } from "react-router-dom";
import AdminService from "../../services/AdminService";
import { useAuth } from "../../context/useAuth";
import { checkAdminRole } from "../../utils/CheckAdminRole";
import customerImage from "../../images/customer.jpg";
import sellerImage from "../../images/seller.jpg";
import productImage from "../../images/product.jpg";

export default function AdminPanel() {
  const { auth, logout } = useAuth();
  const token = auth.token;
  const authemail = auth.email;
  const navigate = useNavigate();
  const [customerCount, setCustomerCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [adminRole, setAdminRole] = useState("");
  // Fetch admin role by email
  useEffect(() => {
    AdminService.getAdminByEmail(authemail, token)
      .then((response) => {
        setAdminRole(response.data.adminRole); // Assuming `role` is the field containing adminRole
        console.log("Admin role received: " + response.data.adminRole);
      })
      .catch((error) => {
        console.log("Failed to fetch admin role", error);
      
      });
  }, [authemail, token]);

  useEffect(() => {
    AdminService.getCustomerCount(token).then((response) => {
      setCustomerCount(response.data);
      console.log("Customer count received: " + response.data);
    });
    AdminService.getSellerCount(token).then((response) => {
      setSellerCount(response.data);
      console.log("Seller count received: " + response.data);
    });
    AdminService.getProductCount(token).then((response) => {
      setProductCount(response.data);
      console.log("Product count received: " + response.data);
    });
  }, [token]);

  //   To handle Navigation
  const handleNavigate = (tab, requiredRole) => {
    if (checkAdminRole(adminRole, requiredRole)) {
      navigate(`/admin/manage?tab=${tab}`);
    }
  };

  return (
    <>
      <div className="admin-panel-container">
        <div className="row admin-panel-row">
          <div className="col-md-4">
            <div className="card admin-card">
              <img
                src={customerImage}
                className="card-img-top admin-card-img"
                alt="Customers"
              />
              <div className="card-body">
                <h5 className="card-title">Customers</h5>
                <p className="card-text">Total customers: {customerCount}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigate("customers", "manageCustomers")}
                  disabled={!checkAdminRole(adminRole, "manageCustomers")}
                >
                  Manage Customers
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card admin-card">
              <img
                src={sellerImage}
                className="card-img-top admin-card-img"
                alt="Sellers"
              />
              <div className="card-body">
                <h5 className="card-title">Sellers</h5>
                <p className="card-text">Total sellers: {sellerCount}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigate("sellers", "manageSellers")}
                  disabled={!checkAdminRole(adminRole, "manageSellers")}
                >
                  Manage Sellers
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card admin-card">
              <img
                src={productImage}
                className="card-img-top admin-card-img"
                alt="Products"
              />
              <div className="card-body">
                <h5 className="card-title">Products</h5>
                <p className="card-text">Total products: {productCount}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigate("products", "manageProducts")}
                  disabled={!checkAdminRole(adminRole, "manageProducts")}
                >
                  Manage Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
