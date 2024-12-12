import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import PaymentService from "../../services/PaymentService";
import CustomerService from "../../services/CustomerService";
import ProductService from "../../services/ProductService";
import "../../css/CartPayment.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ACCOUNT_NUMBER_REGEX = /^\d{7,}$/; // Account number (at least 7 digits)
const UPI_ID_REGEX = /^[\w.-]+@[a-zA-Z]+$/; // UPI ID (format: someID@bank)
const CREDIT_CARD_REGEX = /^\d{16}$/; // Credit card number (exactly 16 digits)
const productService = new ProductService();
export default function BuyNowPayment() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const customer_id = auth.id;
  const token = auth.token;

  const { productId } = useParams();
  const [customer, setCustomer] = useState({});
  const [product, setProduct] = useState({});
  const [productQuantity, setProductQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [paymentMode, setPaymentMode] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentModeNumber, setPaymentModeNumber] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const paymentModeChange = (e) => setPaymentMode(e.target.value);
  const shippingAddressChange = (e) => setShippingAddress(e.target.value);
  const paymentModeNumberChange = (e) => setPaymentModeNumber(e.target.value);

  useEffect(() => {
    // Fetch customer info and product details for Buy Now
    CustomerService.getCustomerByEmail(auth.email, token)
      .then((response) => {
        setCustomer(response.data);
        setPaymentMode(response.data.paymentMode);
        setShippingAddress(response.data.address);
      })
      .catch((error) => console.error(error));

    productService
      .getProductById(productId)
      .then((response) => {
        const product = {
          product_name: response.data.product_name,
          price: response.data.price,
          imgUrl: response.data.imgUrl,
          brand: response.data.brand,
          store_name: response.data.store_name,
          productCategory: response.data.productCategory,
        };
        setProduct(product);
        setTotalPrice(response.data.price * productQuantity);
      })
      .catch((error) => console.error(error));
  }, [auth.email, productId, productQuantity]);

  const handleProductQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setProductQuantity(newQuantity);
    setTotalPrice(newQuantity * product.price);
  };

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
      productId,
      productQuantity,
    };

    PaymentService.buyNowPayment(PaymentRequestDto, token)
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
          <div className="cart-item">
            <div className="cart-item-img">
              <img
                src={product.imgUrl}
                alt={product.product_name}
                width="150"
                height="150"
              />
            </div>
            <div className="cart-item-details">
              <p style={{ fontWeight: "bold" }}>{product.product_name}</p>
              <p>{product.brand}</p>
              <p style={{ color: "green", fontWeight: "bold" }}>
                ₹{product.price}
              </p>

              {/* Quantity input */}
              <p style={{ fontWeight: "bold" }}>Quantity:</p>
              <div className="quantity-group">
                <button
                  className="qty-btn btn-minus"
                  onClick={() => {
                    if (productQuantity > 1) {
                      setProductQuantity(productQuantity - 1);
                    } else {
                      toast.error("Minimum Order quantity '1'");
                    }
                  }}
                >
                  <b>-</b>
                </button>
                <input
                  className="quantity-input"
                  type="number"
                  value={productQuantity}
                  onChange={handleProductQuantityChange}
                  min="1"
                  max="5"
                />
                <button
                  className="qty-btn btn-plus"
                  onClick={() => {
                    if (productQuantity < 5) {
                      setProductQuantity(productQuantity + 1);
                    } else {
                      toast.error("Reached Order quantity limit '5'");
                    }
                  }}
                >
                  <b>+</b>
                </button>
              </div>
            </div>
          </div>
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
      <div className="right-details">
        <h5 className="heading" style={{ marginTop: "30px" }}>
          <b>Price Details</b>
        </h5>
        <div className="price-breakdown">
          <p>
            <b>{1}</b>.&nbsp;&nbsp;₹{product.price} × {productQuantity} ={" "}
            {product.price * productQuantity}
          </p>

          <hr />
          <h5 style={{ color: "green" }}>
            <b>Total Price:&nbsp;&nbsp;₹{totalPrice}</b>
          </h5>
        </div>
      </div>
    </div>
  );
}
