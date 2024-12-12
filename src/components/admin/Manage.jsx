import React, { useEffect, useState } from "react";
import { Tab, Tabs, Table, Modal, Pagination } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import ProductService from "../../services/ProductService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import AdminService from "../../services/AdminService";
import { useAuth } from "../../context/useAuth";
import { checkAdminRole } from "../../utils/CheckAdminRole";
import ConfirmationModal from "../ConfirmationModal";
import "../../css/Manage.css";
const productService = new ProductService();

export default function Manage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [sellerList, setSellerList] = useState([]); // State for sellers
  const [activeTab, setActiveTab] = useState("customers");
  const [isEditing, setIsEditing] = useState(null); // Track the product being edited
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [newCategory, setNewCategory] = useState(""); // Store the new category input
  const [adminRole, setAdminRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const productCategories = [
    "ELECTRONICS",
    "MEN_WEAR",
    "WOMEN_WEAR",
    "HOME_APPLIANCES",
    "BEAUTY",
    "SPORTS",
    "TOYS",
    "BOOKS",
    "GROCERY",
    "FURNITURE",
    "JEWELRY",
    "FOOTWEAR",
  ];
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { auth, logout } = useAuth();
  const token = auth.token;
  const authemail = auth.email;
  const [showSaveConfirmationModal, setShowSaveConfirmationModal] =
    useState(false);
  const [productToSave, setProductToSave] = useState(null);

  // Pagination states
  const [customerPage, setCustomerPage] = useState(1);
  const [sellerPage, setSellerPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const pageSize = 12;
  const productPageSize = 6;
  // Paginated data based on current page and page size
  const paginatedCustomerList = customerList.slice(
    (customerPage - 1) * pageSize,
    customerPage * pageSize
  );
  const paginatedSellerList = sellerList.slice(
    (sellerPage - 1) * pageSize,
    sellerPage * pageSize
  );
  const paginatedProductList = productList.slice(
    (productPage - 1) * productPageSize,
    productPage * productPageSize
  );

  // Pagination Handlers
  const handleCustomerPageChange = (page) => setCustomerPage(page);
  const handleSellerPageChange = (page) => setSellerPage(page);
  const handleProductPageChange = (page) => setProductPage(page);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab); // Set the active tab based on the query param
    }
  }, [location]);
  useEffect(() => {
    AdminService.getAdminByEmail(authemail, token)
      .then((response) => {
        setAdminRole(response.data.adminRole); // Assuming `role` is the field containing adminRole
        console.log("Admin role received: " + response.data.adminRole);
      })
      .catch((error) => {
        console.log("Failed to fetch admin role", error);
        // Handle error if necessary
      });
  }, [authemail, token]);
  useEffect(() => {
    console.log("use effect of get all products fired");
    productService.getAllProducts().then((response) => {
      setProductList(response.data);
      console.log(response.data);
    });
  }, [deleteStatus]);

  useEffect(() => {
    console.log("Fetching sellers...");
    AdminService.getSellers(token)
      .then((response) => {
        console.log("Response data:", response.data);

        // Check if response.data is an object and convert to an array
        if (
          typeof response.data === "object" &&
          !Array.isArray(response.data)
        ) {
          // Convert object to array
          const sellersArray = Object.entries(response.data).map(
            ([id, seller]) => ({
              id, // seller ID
              ...seller, // rest of the seller data
            })
          );
          setSellerList(sellersArray); // Set as an array
        } else {
          console.error("Unexpected data structure:", response.data);
          setSellerList([]); // Reset to an empty array if unexpected
        }
      })
      .catch((error) => {
        console.error("Failed to fetch sellers:", error);
        setSellerList([]); // Set to an empty array on error
      });
  }, [deleteStatus]);

  useEffect(() => {
    console.log("Fetching customers...");
    AdminService.getCustomers(token)
      .then((response) => {
        console.log("Response data:", response.data);
        setCustomerList(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch customers:", error);
        setCustomerList([]);
      });
  }, [deleteStatus]); // Re-fetch when delete status changes

  // Handle category update
  const handleEditCategory = (productId, category) => {
    setIsEditing(productId); // Enable editing mode for the selected product
    setNewCategory(category); // Pre-fill the current category
  };
  const handleSaveCategory = (productId) => {
    setProductToSave(productId); // Set the product to be saved
    setShowSaveConfirmationModal(true); // Show the confirmation modal
  };
  const confirmSaveCategory = () => {
    AdminService.updateProductCategory(productToSave, newCategory, token).then(
      () => {
        productService.getAllProducts().then((response) => {
          setProductList(response.data);
          setIsEditing(null); // Disable editing mode
          setShowSaveConfirmationModal(false); // Close the confirmation modal
          setProductToSave(null); // Reset the product to save
        });
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(null); // Disable editing mode
    setNewCategory(""); // Reset new category input
  };

  const handleDeleteSeller = (sellerId) => {
    AdminService.deleteSeller(sellerId, token)
      .then(() => {
        console.log(`Seller with ID ${sellerId} deleted.`);
        setSellerList(sellerList.filter((seller) => seller.id !== sellerId));
        setDeleteStatus(!deleteStatus); // Toggle deleteStatus to trigger the useEffect for fetching
      })
      .catch((error) => {
        console.error(`Failed to delete seller with ID ${sellerId}:`, error);
      });
  };

  // Deletion Handlers
  const handleDeleteWithConfirmation = (id, type) => {
    setItemToDelete({ id, type });
    setShowConfirmationModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete.type === "customer") {
      handleDeleteCustomer(itemToDelete.id);
    } else if (itemToDelete.type === "seller") {
      handleDeleteSeller(itemToDelete.id);
    } else if (itemToDelete.type === "product") {
      handleDeleteProduct(itemToDelete.id);
    }
    setShowConfirmationModal(false);
    setItemToDelete(null);
  };

  const handleDeleteCustomer = (customerId) => {
    AdminService.deleteCustomer(customerId, token)
      .then(() => {
        console.log(`Customer with ID ${customerId} deleted.`);
        setCustomerList(
          customerList.filter((customer) => customer.id !== customerId)
        );
        setDeleteStatus(!deleteStatus); // Toggle deleteStatus to trigger the useEffect for fetching
      })
      .catch((error) => {
        console.error(
          `Failed to delete customer with ID ${customerId}:`,
          error
        );
      });
  };
  const handleDeleteProduct = (productId) => {
    AdminService.deleteProduct(productId, token)
      .then(() => {
        console.log(`Product with ID ${productId} deleted.`);
        setProductList(
          productList.filter((product) => product.product_id !== productId)
        );
        setDeleteStatus(!deleteStatus);
      })
      .catch((error) => {
        console.error(`Failed to delete product with ID ${productId}:`, error);
      });
  };
  const getRequiredRoleForTab = (tab) => {
    switch (tab) {
      case "customers":
        return "manageCustomers";
      case "sellers":
        return "manageSellers";
      case "products":
        return "manageProducts";
      default:
        return "";
    }
  };

  const handleTabChange = (key) => {
    const requiredRole = getRequiredRoleForTab(key);
    if (checkAdminRole(adminRole, requiredRole)) {
      setActiveTab(key); // Allow access
    } else {
      setModalMessage(`You don't have access to the ${key} tab.`);
      setShowModal(true); // Show modal if no access
    }
  };

  return (
    <>
      <div className="manage-container">
        <h2 className="pageTitle">Manage Data</h2>
        <Tabs
          activeKey={activeTab}
          id="manage-tabs"
          // onSelect={(k) => setActiveTab(k)}
          onSelect={handleTabChange}
        >
          <Tab eventKey="customers" title="Customers">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomerList.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>{customer.customer_id}</td>
                    <td>{customer.user_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.address}</td>
                    <td>{customer.phone_number}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDeleteWithConfirmation(
                            customer.customer_id,
                            "customer"
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              {[...Array(Math.ceil(customerList.length / pageSize)).keys()].map(
                (page) => (
                  <Pagination.Item
                    key={page + 1}
                    active={customerPage === page + 1}
                    onClick={() => handleCustomerPageChange(page + 1)}
                  >
                    {page + 1}
                  </Pagination.Item>
                )
              )}
            </Pagination>
          </Tab>

          <Tab eventKey="sellers" title="Sellers">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Store Name</th>
                  <th>Account Number</th>
                  <th>IFSC Code</th>
                  <th>GST Number</th>
                  <th>Shipping Mode</th>
                  <th>User Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSellerList.map((seller) => (
                  <tr key={seller.id}>
                    <td>{seller.id}</td>
                    <td>{seller.store_name}</td>
                    <td>{seller.account_number}</td>
                    <td>{seller.ifsc_code}</td>
                    <td>{seller.gst_number}</td>
                    <td>{seller.shippingMode}</td>
                    <td>{seller.user_name}</td>
                    <td>{seller.address}</td>
                    <td>{seller.phone_number}</td>
                    <td>{seller.email}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDeleteWithConfirmation(seller.id, "seller")
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              {[...Array(Math.ceil(sellerList.length / pageSize)).keys()].map(
                (page) => (
                  <Pagination.Item
                    key={page + 1}
                    active={sellerPage === page + 1}
                    onClick={() => handleSellerPageChange(page + 1)}
                  >
                    {page + 1}
                  </Pagination.Item>
                )
              )}
            </Pagination>
          </Tab>
          <Tab eventKey="products" title="Products">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th className="table-description">Description</th>
                  <th>Brand</th>
                  <th>Store Name</th>
                  <th>Address</th>
                  <th className="table-category">Category</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProductList.map((product) => (
                  <tr key={product.product_id}>
                    <td className="table-cell">{product.product_id}</td>
                    <td className="table-cell">{product.product_name}</td>
                    <td className="table-cell">{product.stock}</td>
                    <td className="table-cell">{product.price}</td>
                    <td className="table-cell table-description">
                      {product.description}
                    </td>
                    <td className="table-cell">{product.brand}</td>
                    <td className="table-cell">{product.store_name}</td>
                    <td className="table-cell">{product.address}</td>
                    <td className="table-cell table-category">
                      {isEditing === product.product_id ? (
                        <div className="category-edit">
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                          >
                            {productCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          <div className="button-group">
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                handleSaveCategory(product.product_id)
                              }
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="category-view">
                          {product.productCategory}
                          <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() =>
                              handleEditCategory(
                                product.product_id,
                                product.productCategory
                              )
                            }
                            style={{ cursor: "pointer", marginLeft: "8px" }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="table-cell table-image">
                      <img
                        src={product.imgUrl}
                        alt={product.product_name}
                        className="product-image"
                      />
                    </td>{" "}
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDeleteWithConfirmation(
                            product.product_id,
                            "product"
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              {[
                ...Array(
                  Math.ceil(productList.length / productPageSize)
                ).keys(),
              ].map((page) => (
                <Pagination.Item
                  key={page + 1}
                  active={productPage === page + 1}
                  onClick={() => handleProductPageChange(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Tab>
        </Tabs>
        {/* Modal for no-access warning */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>No Access</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
        <ConfirmationModal
          show={showSaveConfirmationModal}
          onHide={() => setShowSaveConfirmationModal(false)}
          onConfirm={confirmSaveCategory}
          title="Confirm Save"
          message="Are you sure you want to save the changes to the product category?"
        />

        <ConfirmationModal
          show={showConfirmationModal}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmationModal(false)}
          message={`Are you sure you want to delete this ${itemToDelete?.type}?`}
        />
      </div>
    </>
  );
}
