import React, { useEffect, useState } from "react";
import CartService from "../../services/CartService";
import { useAuth } from "../../context/useAuth";
import "../../css/Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Cart() {
  const navigate = useNavigate();

  const { auth } = useAuth();
  const token = auth.token;
  const customer_id = auth.id;

  const [cartItems, setCartItems] = useState([]);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0.0);
  const totalPriceChange = (e) => {
    setTotalPrice(e.target.value);
  };

  useEffect(() => {
    // Fetch cart items when the component mounts.
    CartService.getCartItems(customer_id, token)
      .then((response) => {
        const items = response.data.cartItems;
        if (items.length > 0) {
          setCartItems(items);
          setIsCartEmpty(false);
          setTotalPrice(response.data.totalPrice);
          setTotalQuantity(response.data.total_quantity);
        } else {
          setIsCartEmpty(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, [customer_id, token, totalPrice, totalQuantity]);

  const updateQuantity = (productId, newQuantity) => {
    console.log(customer_id, productId, newQuantity, token);
    CartService.updateProductQuantity(
      customer_id,
      productId,
      newQuantity,
      token
    ).then((response) => {
      const updatedItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      setTotalPrice(response.data.totalPrice);
      setTotalQuantity(response.data.total_quantity);
    });
  };

  const removeProduct = (productId) => {
    CartService.removeProductFromCart(customer_id, productId, token)
      .then(() => {
        const updatedCart = cartItems.filter(
          (item) => item.productId !== productId
        );
        setCartItems(updatedCart);
        setTotalQuantity(totalQuantity - cartItems.cart_quantity);
        if (updatedCart.length === 0) {
          setIsCartEmpty(true);
        }
      })
      .catch((error) => console.error("Error removing product:", error));
  };

  const imgClickHandler = (product_name, product_id) => {
    navigate(`/customer/${product_name}/${product_id}`);
  };

  return (
    <div className="cart-container">
      <ToastContainer />
      {isCartEmpty ? (
        <div className="empty-cart">
          <img
            src="https://aleointernational.com/img/empty-cart-yellow.png"
            alt="Empty Cart"
            className="empty-cart-image"
          />
        </div>
      ) : (
        <div className="cart-content">
          {/* Left Side: Cart Items */}
          <div className="cart-items left-column">
            {cartItems.map((item, key) => (
              <div className="cart-item" key={item.product_id}>
                <div>
                  <p>
                    <b>{key + 1}</b>. &nbsp; &nbsp;
                  </p>
                </div>
                <div
                  className="cart-item-image"
                  onClick={() =>
                    imgClickHandler(item.product_name, item.product_id)
                  }
                >
                  <img
                    src={item.imgUrl}
                    alt={item.productName}
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
                  {/* <p>{item.description}</p> */}
                  <p>
                    <b>Seller : </b>&nbsp;{item.store_name}
                  </p>
                  <p>
                    <b>Quantity:</b>{" "}
                    <div className="quantity-group">
                      <button
                        className="qty-btn btn-minus"
                        onClick={() => {
                          item.cart_quantity > 1
                            ? updateQuantity(
                                item.product_id,
                                item.cart_quantity - 1
                              )
                            : toast.error("Minimum Order quantity '1'");
                        }}
                      >
                        <b>-</b>
                      </button>
                      <input
                        className="quantity-input"
                        type="number"
                        value={item.cart_quantity}
                        readOnly
                        min="1"
                        max="5"
                      />
                      <button
                        className="qty-btn btn-plus"
                        onClick={() => {
                          item.cart_quantity < 5
                            ? updateQuantity(
                                item.product_id,
                                item.cart_quantity + 1
                              )
                            : toast.error("Reached Order quantity limit '5'");
                        }}
                      >
                        <b>+</b>
                      </button>
                    </div>
                  </p>
                </div>
                <div>
                  <button
                    className="remove-item"
                    onClick={() => removeProduct(item.product_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Price Details */}
          <div className="right-column cart-summary">
            <h5>Price Details</h5>
            <br />
            <div className="price-breakdown">
              {cartItems.map((item, key) => (
                <p key={key}>
                  <b>{key + 1}</b>. &nbsp; &nbsp; ₹{item.price} ×{" "}
                  {item.cart_quantity} = {item.price * item.cart_quantity}
                </p>
              ))}
              <hr />
              <br />
              <h5 style={{ color: "green" }}>
                Total Price:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹{totalPrice}
              </h5>
              <br />
            </div>
            <center>
              <Link className="place-order-button" to="/customer/cart/payment">
                Place Order
              </Link>
            </center>
          </div>
        </div>
      )}
    </div>
  );
}
