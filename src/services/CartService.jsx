import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/quitq/cart/customer";

class CartService {

  // Add a product to the cart
  addProductToCart(customer_id, product_id, quantity, token) {
    return axios({
      method: "post",
      url: `${BASE_URL}/${customer_id}/addProduct?productId=${product_id}&quantity=${quantity}`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Update product quantity in the cart
  updateProductQuantity(customer_id, productId, quantity, token) {
    return axios({
      method: "put",
      url: `${BASE_URL}/${customer_id}/updateProductQuantity?productId=${productId}&quantity=${quantity}`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get all items in the cart
  getCartItems(customer_id, token) {
    return axios({
      method: "get",
      url: `${BASE_URL}/${customer_id}/items`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get the total product count in the cart
  getProductCountInCart(customer_id, token) {
    return axios({
      method: "get",
      url: `${BASE_URL}/${customer_id}/productCount`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Check if the cart is empty
  isCartEmpty(customer_id, token) {
    return axios({
      method: "get",
      url: `${BASE_URL}/${customer_id}/isEmpty`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Remove a product from the cart
  removeProductFromCart(customer_id, productId, token) {
    return axios({
      method: "delete",
      url: `${BASE_URL}/${customer_id}/removeProduct?productId=${productId}`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Clear the cart
  clearCart(customer_id, token) {
    return axios({
      method: "delete",
      url: `${BASE_URL}/${customer_id}/clear`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get the total price of the cart
  getCartTotalPrice(customer_id, token) {
    return axios({
      method: "get",
      url: `${BASE_URL}/${customer_id}/totalPrice`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new CartService();
