import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/products";
 
class ProductService {
  getAllProducts() {
    return axios.get("http://localhost:8081/api/v1/products/getallproducts");
  }
 
  getProductById(pid) {
    return axios.get(
      "http://localhost:8081/api/v1/products/getproductbyid/" + pid
    );
  }
 
  searchProductsByName(query) {
    return axios.get(
      `http://localhost:8081/api/v1/products/search?productName=${query}`
    );
  }
 
  getProductsByCategory(category) {
    return axios.get(
      `http://localhost:8081/api/v1/products/getproductbycategory?category=${category}`
    );
  }
 
  getAllProductsBySellerId(seller_id, token) {
    return axios({
      method: "get",
      url: BASE_URL + "/seller/" + seller_id,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
 
  // Method to get products by brand
  getProductsByBrand(brand) {
    return axios.get(
      "http://localhost:8081/api/v1/products/getproductbybrand",
      {
        params: { brand },
      }
    );
  }
 
  createProduct(email, updatedProduct, token) {
    return axios({
      method: "post",
      url: BASE_URL + "/seller/create?email=" + email,
      data: updatedProduct,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
 
  updateProduct(product_id, updatedProduct, token) {
    return axios({
      method: "put",
      url: BASE_URL + "/seller/update/" + product_id,
      data: updatedProduct,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }
 
  getOffers() {
    return axios.get(
      "http://localhost:8081/api/v1/products/getallactiveoffers",
    );
  }
}
 
export default ProductService;