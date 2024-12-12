import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductModal from "../ProductModal";
import { useAuth } from "../../context/useAuth";
import placeholderImage from "../../images/product_placeholder.png";
const productService = new ProductService();

export default function SellerProduct() {
  const navigate = useNavigate();
  const { product_id } = useParams();
  const [product, setProduct] = useState({});
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const { auth } = useAuth();
  const token = auth.token;
  const authemail = auth.email;
  useEffect(() => {
    if (product_id) {
      productService.getProductById(product_id).then((response) => {
        const productData = response.data || {};
        setProduct(productData);
        setUpdatedProduct(productData);
      });
    } else {
      // If no product_id, set it for creation (empty object)
      setProduct({});
      setUpdatedProduct({});
      setIsEditMode(false);
    }
  }, [product_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleSaveOrUpdate = () => {
    if (isEditMode) {
      productService
        .updateProduct(product_id, updatedProduct, token)
        .then(() => {
          setProduct(updatedProduct);
          toast.success("Product updated successfully!", { autoClose: 2000 });
          setTimeout(() => {
            setShowModal(false);
          }, 2000);

          console.log("Product updated successfully!");
        });
    } else {
      productService
        .createProduct(authemail, updatedProduct, token)
        .then(() => {
          setShowModal(false);
          console.log("Product created successfully!");
          toast.success("Product created successfully!");
          setTimeout(() => {
            navigate("/seller");
          }, 2000);
        });
    }
  };

  const handleCancel = () => {
    setUpdatedProduct(product);
    setShowModal(false);
  };

  const toggleModal = () => {
    setShowModal(true);
  };

  return (
    <div className="product-container">
      <ToastContainer />
      <div className="left-product">
        <img
          className="main-product-image"
          src={product.imgUrl || placeholderImage}
          alt={product.product_name || "Product Image"}
        />
      </div>

      <div className="right-product">
        <h2>{product.product_name || "<Product Name>"}</h2>
        <h4 className="price">₹{product.price || "<Price>"}</h4>
        <h6>{product.brand || "<Brand Name>"}</h6>
        <h5>
          <b>Stock:</b> {product.stock || "<No Stock>"} available
        </h5>
        <h5>
          <b>Category:</b> {product.productCategory || "<Category>"}{" "}
        </h5>
        <p>{product.description || "<Description goes here>"}</p>

        <div className="button-group">
          <button className="btn btn-edit btn-primary" onClick={toggleModal}>
            <FontAwesomeIcon icon={faEdit} /> {isEditMode ? "Edit" : "Create"}{" "}
            Product
          </button>
        </div>
      </div>

      {/* Reusable ProductModal for both create and edit */}
      <ProductModal
        show={showModal}
        handleClose={handleCancel}
        handleSave={handleSaveOrUpdate}
        product={updatedProduct}
        handleInputChange={handleInputChange}
        isEditMode={isEditMode}
      />
    </div>
  );
}
