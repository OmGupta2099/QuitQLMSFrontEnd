import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/quitq/admin";

class AdminService {
  getAdminByEmail(email, token) {
    return axios({
      method: "get",
      url: BASE_URL + "/email?email=" + email,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getCustomerCount(token) {
    return axios({
      method: "get",
      url: BASE_URL + "/customers/count",
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getSellerCount(token) {
    return axios({
      method: "get",
      url: BASE_URL + "/sellers/count",
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getProductCount(token) {
    return axios({
      method: "get",
      url: BASE_URL + "/products/count",
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  updateProductCategory(productId, newCategory, token) {
    return axios({
      method: "put",
      url: `${BASE_URL}/updateProductCategory/${productId}?category=${newCategory}`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  deleteProduct(productId, token) {
    return axios({
      method: "delete",
      url: `${BASE_URL}/products/delete/${productId}`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Fetch sellers
  getSellers(token) {
    return axios({
      method: "get",
      url: `${BASE_URL}/getsellers`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Delete seller
  deleteSeller(sellerId, token) {
    return axios({
      method: "delete",
      url: `${BASE_URL}/sellers/delete/${sellerId}`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get customers
  getCustomers(token) {
    return axios({
      method: "get",
      url: `${BASE_URL}/getcustomers`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Delete customer
  deleteCustomer(customerId, token) {
    return axios({
      method: "delete",
      url: `${BASE_URL}/customers/delete/${customerId}`,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  //update customer by email
  updateAdmin(adminObj, email, token) {
    return axios({
      method: "put",

      url: BASE_URL + "/updateadmin?email=" + email,
      data: adminObj,

      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new AdminService();
