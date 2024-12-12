import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const ProductModal = ({
  show,
  handleClose,
  handleSave,
  product,
  handleInputChange,
  isEditMode,
}) => {
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
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? "Edit Product" : "Create Product"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="product_name"
              value={product.product_name || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={product.price || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formBrand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              value={product.brand || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={product.stock || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={product.description || ""}
              onChange={handleInputChange}
            />
          </Form.Group>{" "}
          <Form.Group controlId="formProductCategory">
            <Form.Label>Product Category</Form.Label>
            <Form.Control
              as="select"
              name="productCategory"
              value={product.productCategory || ""}
              onChange={handleInputChange}
            >
              <option value="">Select a category</option>
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category.replace("_", " ")}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formImageUrl">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="imgUrl"
              value={product.imgUrl || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} /> Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <FontAwesomeIcon icon={faCheck} /> {isEditMode ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
