import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/quitq/auth";
class AuthService {

  //CUSTOMER REGISTRATION
  registerCustomer(customerRegistrationobj) {
    return axios({
      method: "post",

      url: BASE_URL + "/customer/register",
      data: customerRegistrationobj,

      headers: { "X-Custom-Header": "foobar" },
    });
  }

  //SELLER REGISTRATION
  registerSeller(sellerRegistrationobj) {
    return axios({
      method: "post",

      url: BASE_URL + "/seller/registerseller",
      data: sellerRegistrationobj,

      headers: { "X-Custom-Header": "foobar" },
    });
  }

  //USER LOGIN
  loginUser(userObj) {
    return axios({
      method: "post",

      url: BASE_URL + "/login",
      data: userObj,

      headers: { "X-Custom-Header": "foobar" },
    });
  }
}
export default new AuthService();
