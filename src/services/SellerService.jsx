import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/quitq/seller";
class SellerService {

  //Get Seller with email
  getSellerByEmail(email, token) {
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

  //Update seller
  updateSeller(sellerRegistrationobj, email,token) {
    return axios({
      method: "put",
      url: BASE_URL + "/updateseller?email=" + email,
      data: sellerRegistrationobj,

      headers: {
        "Access-Control-Allow-Origin": "*",

        Authorization: `Bearer ${token}`,
      },
    });
  }
}
export default new SellerService();
