import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import "../css/Product.css";
import CartService from "../services/CartService";
import { useAuth } from "../context/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
const productService = new ProductService();
 
export default function Product() {
  const navigate = useNavigate();
  const { auth, activeOffers } = useAuth();
  console.log(activeOffers);
  const token = auth.token;
  const customer_id = auth.id;
  const quantity = 1;
  const { product_id } = useParams();
  const [product, setProduct] = useState({});
 
  useEffect(() => {
    console.log("Fetching product by ID...");
    productService.getProductById(product_id).then((response) => {
      const productData = response.data || {}; // Add fallback
      setProduct(productData);
    });
  }, [product_id]);
 
  const addToCart = () => {
    if (token) {
      console.log(customer_id, product_id, quantity, token);
      CartService.addProductToCart(customer_id, product_id, quantity, token)
        .then(() => {
          toast.success("Product added to cart successfully!");
          setTimeout(() => {
            navigate(`/customer/cart`);
          }, 2000);
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          toast.error("Failed to add product to cart.");
        });
    } else {
      toast.error("Login to add product to cart");
      setTimeout(() => {
        navigate(`/login`);
      }, 2000);
    }
  };
 
  const buyNow = () => {
    if (token) {
      navigate(`/customer/buynow/${product_id}`);
    } else {
      toast.error("Login to buy this product");
      setTimeout(() => {
        navigate(`/login`);
      }, 2000);
    }
  };
 
  // Safely calculate the highest discount benefit

  const highestBenefit = activeOffers?.reduce(
    (max, offer) => (offer.benefit > max ? offer.benefit : max),
    0
  );
 
  // Calculate the discounted price

  const discountedPrice =
    highestBenefit > 0
      ? product.price - (highestBenefit / 100) * product.price
      : product.price;

  return (
<div className="product-container">

      {/* Toastify container */}
<ToastContainer />
<div className="left-product">

        {/* Main Image */}
<img

          className="main-product-image"

          src={product.imgUrl || "default-image-path.jpg"}

          alt={product.product_name || "Product Image"}

        />
</div>
 
      <div className="right-product">
<h2>{product.product_name}</h2>
 
        {/* Show discounted price if offers exist */}

        {highestBenefit > 0 ? (
<div className="price-section">
<h4 className="price text-danger">

              ₹{discountedPrice.toFixed(2)}
</h4>
<h6 className="text-muted text-decoration-line-through">

              ₹{product.price}
</h6>
<p className="offer-benefit">

              Save {highestBenefit}% with active offers!
</p>
</div>

        ) : (
<h4 className="price">₹{product.price}</h4>

        )}
 
        <h6>{product.brand}</h6>
 
        {/* Additional Product Details */}
<p>{product.description}</p>
<h6>
<b>Store:</b> {product.store_name}
</h6>
<h6>
<b>Address: </b>

          {product.address}
</h6>
 
        {/* Stock Check */}

        {product.stock === 0 ? (
<p className="out-of-stock-message" style={{ color: "red" }}>

            Out of Stock. We will get back soon!
</p>

        ) : (
<h6 style={{ color: "green" }}>
<b>In Stock</b>
</h6>

        )}
 
        {/* Buttons below text */}
<div className="button-group">
<button

            className="btn btn-add-to-cart productbtn"

            onClick={addToCart}

            disabled={product.stock === 0} // Disable if stock is 0
>
<img

              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header_cart-eed150.svg"

              alt="Cart"

              width="24"

              height="24"

            />
&nbsp; ADD TO CART
</button>
<button

            className="btn btn-buy-now productbtn"

            onClick={buyNow}

            disabled={product.stock === 0} // Disable if stock is 0
>
<img

              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/downloadApp-2ea657.svg"

              alt="Buy Now"

              width="24"

              height="24"

            />
&nbsp; BUY NOW
</button>
</div>
</div>
</div>

  );

}
