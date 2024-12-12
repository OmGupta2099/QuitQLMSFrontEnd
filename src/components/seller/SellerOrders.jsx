import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import ConfirmationModal from "../ConfirmationModal";
import OrderService from "../../services/OrderService";
import newOrderImg from "../../images/newOrder.png";

// Enum to get all status values
const orderStatuses = [
  "CONFIRMED",
  "PENDING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const SellerOrders = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const token = auth.token;
  const seller_id = auth.id;
  const [orderList, setOrderList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const ordersPerPage = 5; // Set orders per page
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch seller's orders on component mount
  useEffect(() => {
    OrderService.getSellerOrder(seller_id, token)
      .then((response) => {
        const orders = Array.isArray(response.data) ? response.data : [];
        setOrderList(orders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setOrderList([]);
      });
  }, [seller_id, token]);

  const handleStatusChange = (order_items_id, currentStatus) => {
    setSelectedOrderId(order_items_id);
    setNewOrderStatus(currentStatus);
    setShowModal(true);
  };
  const confirmStatusChange = () => {
    if (selectedOrderId) {
      OrderService.updateOrderStatus(selectedOrderId, newOrderStatus, token)
        .then((response) => {
          // alert(response.data);
          OrderService.getSellerOrder(seller_id, token).then((response) => {
            setOrderList(response.data);
          });
        })
        .catch((error) => {
          console.error("Error updating order status:", error);
        })
        .finally(() => {
          setShowModal(false); // Close the modal after the operation
        });
    }
  };

  const imgClickHandler = (product_name, product_id) => {
    navigate(`/seller/${product_name}/${product_id}`);
  };

  // Pagination Logic
  const totalOrders = orderList.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = orderList.slice(startIndex, startIndex + ordersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="orders-container">
      {currentOrders.length === 0 ? (
        <p className="no-orders-message">No orders for your product.</p>
      ) : (
        currentOrders.map((order) => (
          <div
            key={order.order_items_id}
            className={`order-item ${
              order.orderStatus === "CONFIRMED" ? "highlight-order" : ""
            }`}
          >
            {/* Product Information */}
            <div className="product-info">
              <img
                src={order.imgUrl}
                alt={order.product_name}
                className="order-item-img"
                onClick={() =>
                  imgClickHandler(order.product_name, order.product_id)
                }
              />
              <div className="product-details">
                <h5
                  className="product-name"
                  onClick={() =>
                    imgClickHandler(order.product_name, order.product_id)
                  }
                >
                  {order.product_name}
                </h5>
                <p className="product-category">{order.productCategory}</p>
                <p className="product-brand">Brand: {order.brand}</p>
                <p className="product-price">₹{order.price}</p>
                <p className="order-quantity">
                  Quantity: {order.orderItemQuantity}
                </p>
                <p className="total-price">Total: ₹{order.totalPrice}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="customer-info">
              <br />
              <p className="customer-name">
                <b>Customer: {order.customer_name}</b>
              </p>
              <p>Email: {order.email}</p>
              <p>Phone: {order.phone_number}</p>
              <p>Address: {order.shippingAddress}</p>
              <p>
                Order Date:{" "}
                {new Date(order.orderDate).toLocaleDateString("en-GB")}
              </p>
              <p>Payment: {order.paymentMode}</p>
            </div>

            {/* Order Status and Status Change */}
            <div className="order-status-container">
              {/* New Order Image */}
              {order.orderStatus === "CONFIRMED" && (
                <img
                  src={newOrderImg}
                  alt="New Order"
                  className="new-order-image"
                />
              )}

              {/* Payment Status */}
              <p>
                Payment Status:
                {order.orderStatus !== "CANCELLED" ? (
                  order.paymentStatus === "PAYMENT_SUCCESS" ? (
                    <span className="paid-status"> Paid</span>
                  ) : (
                    " Not Paid"
                  )
                ) : (
                  " Not Applicable"
                )}
              </p>

              {/* Order Status */}
              <p className={`order-status ${order.orderStatus.toLowerCase()}`}>
                Status: {order.orderStatus}
              </p>

              {order.orderStatus !== "CANCELLED" &&
                order.orderStatus !== "DELIVERED" && (
                  <>
                    <label htmlFor={`status-${order.order_items_id}`}>
                      <b>Update Status</b>
                    </label>
                    <select
                      id={`status-${order.order_items_id}`}
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.order_items_id, e.target.value)
                      }
                      className="status-dropdown"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </>
                )}
            </div>
          </div>
        ))
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onConfirm={confirmStatusChange}
        onCancel={() => setShowModal(false)}
        message={`Are you sure you want to update the order status to "${newOrderStatus}"?`}
      />
      {/* Pagination Controls */}
      {totalOrders > ordersPerPage && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center mt-4">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                key={index}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SellerOrders;
