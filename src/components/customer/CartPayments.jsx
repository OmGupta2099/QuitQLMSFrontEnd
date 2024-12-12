import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import CartService from "../../services/CartService";
import { useNavigate } from "react-router-dom";
import "../../css/CartPayment.css";
import {
  faInfoCircle,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import PaymentService from "../../services/PaymentService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ACCOUNT_NUMBER_REGEX = /^\d{7,}$/; // Account number (at least 7 digits)
const UPI_ID_REGEX = /^[\w.-]+@[a-zA-Z]+$/; // UPI ID (format: someID@bank)
const CREDIT_CARD_REGEX = /^\d{16}$/; // Credit card number (exactly 16 digits)
export default function CartPayments() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const customer_id = auth.id;
  const token = auth.token;

  const [cart, setCart] = useState({});
  const [customer, setCustomer] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [paymentMode, setPaymentMode] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentModeNumber, setPaymentModeNumber] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const paymentModeChange = (e) => setPaymentMode(e.target.value);
  const shippingAddressChange = (e) => setShippingAddress(e.target.value);
  const paymentModeNumberChange = (e) => setPaymentModeNumber(e.target.value);

  useEffect(() => {
    CartService.getCartItems(customer_id, token)
      .then((response) => {
        setCart(response.data);
        if (response.data.cartItems.length > 0) {
          setCartItems(response.data.cartItems);
          setCustomer(response.data.customerDto);
          setPaymentMode(response.data.customerDto.paymentMode);
          setShippingAddress(response.data.customerDto.address);
          setTotalPrice(response.data.totalPrice);
        }
      })
      .catch((error) => console.error(error));
  }, [customer_id, token]);

  const handleCreatePayment = () => {
    if (!paymentMode || !paymentModeNumber) {
      toast.error("Please fill the Payment Details");
      return;
    }

    // Validation based on payment mode
    let isValid = true;
    let errorMessage = "";

    switch (paymentMode) {
      case "CreditCard":
        isValid = CREDIT_CARD_REGEX.test(paymentModeNumber);
        if (!isValid)
          errorMessage = "Please enter a valid 16-digit credit card number.";
        break;
      case "NetBanking":
        isValid = ACCOUNT_NUMBER_REGEX.test(paymentModeNumber);
        if (!isValid)
          errorMessage =
            "Please enter a valid account number with at least 7 digits.";
        break;
      case "UPI":
        isValid = UPI_ID_REGEX.test(paymentModeNumber);
        if (!isValid)
          errorMessage =
            "Please enter a valid UPI ID in the format someID@bank.";
        break;
      default:
        isValid = false;
        errorMessage = "Please select a valid payment method.";
    }

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    const PaymentRequestDto = {
      customerId: customer_id,
      shippingAddress,
      paymentModeNumber,
      paymentMode,
    };
    console.log("Payment dto: " + PaymentRequestDto);
    if (cart) {
      PaymentService.cartPayment(PaymentRequestDto, token)
        .then((response) => {
          toast.success(response.data.paymentStatus);
          setTimeout(() => {
            navigate("/customer/orders");
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Payment failed. Please try again.");
        });
    }
  };

  const imgClickHandler = (product_name, product_id) => {
    navigate(`/customer/${product_name}/${product_id}`);
  };

  return (
    <div className="paymentContainer">
      <ToastContainer />
      {/* Left Details */}
      <div className="left-details">
        <h5 className="heading" style={{ marginTop: "30px" }}>
          <b>PERSON DETAILS</b>
        </h5>
        <div className="PersonDetails">
          <p>
            <b>Name:</b> {customer.user_name}
          </p>
          <p>
            <b>Phone:</b> {customer.phone_number}
          </p>
          <p>
            <b>Email:</b> {customer.email}
          </p>
          <p>
            <b>Address:</b> {customer.address}
          </p>
          <p>
            <b>Payment Mode:</b> {customer.paymentMode}
          </p>
        </div>
        <hr />
        <h5 className="heading">
          <b>ORDER ITEMS</b>
        </h5>
        <div className="cartItemDetails">
          {cartItems.map((item, key) => (
            <div className="cart-item" key={item.product_id}>
              <div>
                <p>
                  <b>{key + 1}</b>.&nbsp;&nbsp;
                </p>
              </div>
              <div
                className="cart-item-img"
                onClick={() =>
                  imgClickHandler(item.product_name, item.product_id)
                }
              >
                <img
                  src={item.imgUrl}
                  alt={item.product_name}
                  width="150"
                  height="150"
                />
              </div>
              <div className="cart-item-details">
                <p
                  style={{ fontWeight: "bold" }}
                  onClick={() =>
                    imgClickHandler(item.product_name, item.product_id)
                  }
                >
                  {item.product_name}
                </p>
                <p>{item.brand}</p>
                <p style={{ color: "green", fontWeight: "bold" }}>
                  ₹{item.price}
                </p>
                <p style={{ fontWeight: "bold" }}>
                  Quantity:{" "}
                  <input
                    type="number"
                    value={item.cart_quantity}
                    readOnly
                    min="1"
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
        <hr />
        <h5 className="heading">
          <b>PAYMENT DETAILS</b>
        </h5>
        <div className="payment-details">
          <div className="payment-col">
            <label className="col-form-label" style={{ fontWeight: "bold" }}>
              Shipping Address{" "}
              <a
                href="#"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
              >
                Edit
              </a>
            </label>
            <input
              type="text"
              className="form-control"
              value={shippingAddress}
              onChange={shippingAddressChange}
              readOnly={!isEditingAddress}
            />
          </div>

          <div className="payment-col">
            <label className="col-form-label" style={{ fontWeight: "bold" }}>
              Payment Mode
            </label>
            <select
              className="form-select"
              value={paymentMode}
              onChange={paymentModeChange}
            >
              <option value="" disabled>
                Choose...
              </option>
              <option value="UPI">UPI</option>
              <option value="NetBanking">NET BANKING</option>
              <option value="CreditCard">CREDIT CARD</option>
            </select>
          </div>

          <div className="payment-col">
            {paymentMode === "CreditCard" ? (
              <label className="col-form-label" style={{ fontWeight: "bold" }}>
                Credit Card Number
              </label>
            ) : paymentMode === "NetBanking" ? (
              <label className="col-form-label" style={{ fontWeight: "bold" }}>
                Account Number
              </label>
            ) : paymentMode === "UPI" ? (
              <label className="col-form-label" style={{ fontWeight: "bold" }}>
                UPI Id
              </label>
            ) : (
              <label className="col-form-label" style={{ fontWeight: "bold" }}>
                Select a payment method
              </label>
            )}

            <input
              type="text"
              className="form-control"
              value={paymentModeNumber}
              onChange={paymentModeNumberChange}
            />
          </div>

          <div className="payment-col">
            <label className="col-form-label" style={{ fontWeight: "bold" }}>
              Amount
            </label>
            <input
              style={{ color: "green", fontWeight: "bold" }}
              type="number"
              className="form-control"
              value={totalPrice}
              readOnly
            />
          </div>
          <br />
          <center>
            <button className="paymentbtn" onClick={handleCreatePayment}>
              Create Payment
            </button>
          </center>
        </div>
      </div>

      {/* Right Details */}
      <div className="right-details">
        <h5 className="heading" style={{ marginTop: "30px" }}>
          <b>Price Details</b>
        </h5>
        <div className="price-breakdown">
          {cartItems.map((item, key) => (
            <p key={key}>
              <b>{key + 1}</b>.&nbsp;&nbsp;₹{item.price} × {item.cart_quantity}{" "}
              = {item.price * item.cart_quantity}
            </p>
          ))}
          <hr />
          <h5 style={{ color: "green" }}>
            <b>Total Price:&nbsp;&nbsp;₹{totalPrice}</b>
          </h5>
        </div>
      </div>
    </div>
  );
}
