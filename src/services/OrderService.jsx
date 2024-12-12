
import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/quitq/orders";

class OrderService {

  //get customer orders by customer id
  getCustomerOrder(customer_id, token) {
    return axios({
      method: "get",
      url: BASE_URL + "/customer/" + customer_id,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  cancleOrderItem(order_items_id,token){
    return axios({
        method: "put",
        url: "http://localhost:8080/api/v1/quitq/orderitem/customer/cancel/"+ order_items_id,
        responseType: "json",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      });
  }

  getSellerOrder(seller_id, token) {
    return axios({
      method: "get",
      url: "http://localhost:8080/api/v1/quitq/orderitem/find/orderitems/byseller?sellerId=" + seller_id,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  

  updateOrderStatus(order_items_id, status, token) {
    return axios({
      method: "put",
      url: "http://localhost:8080/api/v1/quitq/orderitem/status/update/"+order_items_id+"?status="+status,
      responseType: "json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
  }

}
export default new OrderService();