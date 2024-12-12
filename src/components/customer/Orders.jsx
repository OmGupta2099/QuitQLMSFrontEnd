import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import OrderService from "../../services/OrderService";
import "../../css/Orders.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable";
import CustomerService from "../../services/CustomerService";
import "../../css/SellerOrders.css";
import ConfirmationModal from "../ConfirmationModal";
import logo from "../../images/Logo1.png";
export default function Orders() {
  const navigate = useNavigate();

  const { auth } = useAuth();
  const token = auth.token;
  const authemail = auth.email;
  const customer_id = auth.id;
  const [orders, setOrders] = useState([]);
  //   const [customer_id, setCustomer_id] = useState("");
  const [customer_name, setCustomer_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_Number] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const ordersPerPage = 3;
  useEffect(() => {
    console.log("get account use effect fired...");
    CustomerService.getCustomerByEmail(authemail, token).then((response) => {
      //setCustomer_id(response.data.id);
      setCustomer_name(response.data.user_name);
      setPhone_Number(response.data.phone_number);
      setEmail(response.data.email);
    });
  }, [authemail, token]);
  // Function to fetch orders
  const fetchOrders = () => {
    OrderService.getCustomerOrder(customer_id, token)
      .then((response) => {
        console.log("Fetched orders:", response.data);
        const data = response.data || []; // Ensure data is an array or set to empty array
        setOrders(Array.isArray(data) ? data : []); // Check if data is an array, otherwise set empty array
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setOrders([]);
      });
  };

  // Fetch orders on initial render and when customer_id changes
  useEffect(() => {
    fetchOrders();
  }, [customer_id]);

  const handleCancelOrder = (order_items_id) => {
    setOrderToCancel(order_items_id);
    setShowModal(true);
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      OrderService.cancleOrderItem(orderToCancel, token)
        .then((response) => {
          console.log(response.data);
          fetchOrders();
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error canceling order:", error);
          setShowModal(false);
        });
    }
  };

  const imgClickHandler = (product_name, product_id) => {
    navigate(`/customer/${product_name}/${product_id}`);
  };

  // Function to generate PDF invoice
  const generatePDF = (order) => {
    const doc = new jsPDF();

    // Add the logo image
    const imgData = logo; // Use the imported logo
    const logoWidth = 40; // Set logo width
    const logoHeight = 20; // Set logo height
    doc.addImage(imgData, "PNG", 12, 10, logoWidth, logoHeight); // Add logo to the PDF at position (10, 10)

    doc.setFontSize(12);
    doc.text(
      `Invoice Date: ${new Date(order.orderDate).toLocaleDateString("en-GB")}`,
      14,
      40
    );

    // Add customer name and phone number
    doc.text(`Customer Name: ${customer_name}`, 14, 50);
    doc.text(`Phone Number: ${phone_number}`, 14, 60);

    doc.text(`Total Amount: Rs. ${order.totalOrderAmount.toFixed(2)}`, 14, 70);
    doc.text(`Shipping Address: ${order.shippingAddress}`, 14, 80);

    // Prepare data for table
    const columns = [
      "Product Name",
      "Store Name",
      "Quantity",
      "Price \n(INR)",
      "Total \n(INR)",
    ];
    const rows = order.orderItems.map((item) => [
      item.product_name,
      item.store_name, // Include store name
      item.orderItemQuantity,
      `${item.price.toFixed(2)}`,
      `${item.totalPrice.toFixed(2)}`,
    ]);

    // Add total quantity and total amount to the end of the rows
    const totalQuantity = order.orderItems.reduce(
      (sum, item) => sum + item.orderItemQuantity,
      0
    );
    const totalAmount = order.totalOrderAmount.toFixed(2);

    rows.push(["TOTAL", "", totalQuantity, "", `${totalAmount}`]); // Add total quantity and total amount as a new row

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 90, // Adjust the starting Y position to make space for the logo and text
    });

    // Save the generated PDF
    doc.save(`Invoice_Order.pdf`);
  };
  // Pagination logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + ordersPerPage);

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
      {/* Customer Details */}
      <div className="customer-details">
        <h5>
          <b>PERSONAL DETAILS</b>
        </h5>
        <hr />
        <p>
          <b>Name: </b>
          {customer_name}
        </p>
        <p>
          <b>Email: </b>
          {email}
        </p>
        <p>
          <b>Phone: </b>
          {phone_number}
        </p>
      </div>

      <hr />

      {/* Orders Section */}
      <h5>
        <b>ORDERS</b>
      </h5>
      {currentOrders.length > 0 ? (
        currentOrders.map((order, orderIndex) => (
          <div key={orderIndex} className="order-section">
            {/* Order Header */}
            <div className="order-header">
              <h6>
                <b>
                  {orderIndex + 1}. Order Date:{" "}
                  {new Date(order.orderDate).toLocaleDateString("en-GB")}
                </b>
              </h6>
              <p>Payment Mode: {order.paymentMode}</p>
              <p>Shipping Address: {order.shippingAddress}</p>
              <p style={{ color: "green" }}>
                <b>Total Amount: </b>₹{order.totalOrderAmount.toFixed(2)}
              </p>
            </div>
            {/* Order Items */}
            <div className="order-items">
              {order.orderItems.map((item, itemIndex) => (
                <div key={itemIndex} className="order-item">
                  {/* Image and Product Details */}
                  <img
                    src={item.imgUrl}
                    alt={item.product_name}
                    className="order-item-img"
                    onClick={() =>
                      imgClickHandler(item.product_name, item.product_id)
                    }
                  />
                  <div className="order-item-details">
                    <h5
                      onClick={() =>
                        imgClickHandler(item.product_name, item.product_id)
                      }
                    >
                      {item.product_name}
                    </h5>
                    <p>Quantity: {item.orderItemQuantity}</p>
                    <p>Brand: {item.brand}</p>
                    <p>
                      <b>Store:</b> {item.store_name} ({item.store_location})
                    </p>
                    <p>Price: ₹{item.price.toFixed(2)}</p>
                    <p style={{ color: "green" }}>
                      Total Price: ₹{item.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Order Status and Cancel Button */}
                  <div className="order-status">
                    <p>
                      Status:{" "}
                      <b style={{ color: "blue", fontSize: "smaller" }}>
                        {item.orderStatus}
                      </b>
                    </p>
                    {/* Conditional rendering for the Cancel button */}
                    {item.orderStatus !== "CANCELLED" &&
                      item.orderStatus !== "DELIVERED" && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelOrder(item.order_items_id)}
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>{" "}
            {/* View Invoice Button */}
            <button className="invoice-btn" onClick={() => generatePDF(order)}>
              Download Invoice
            </button>
            <hr /> {/* Divider between orders */}
          </div>
        ))
      ) : (
        <p>No orders available.</p>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
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
      {showModal && (
        <ConfirmationModal
          show={showModal}
          title="Cancel Order"
          message="Are you sure you want to cancel this order?"
          onConfirm={confirmCancelOrder}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
