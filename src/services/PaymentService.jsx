import axios from "axios";

const BASE_URL = "http://localhost:8081/api/v1/quitq/payments/for"

class PaymentService{
    cartPayment(PaymentRequestDto,token){
        return axios({
            method: "post",
            url: BASE_URL + "/cart",
            data:PaymentRequestDto,
            responseType: "json",
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          });
    }

    buyNowPayment(PaymentRequestDto,token){
        return axios({
            method: "post",
            url: BASE_URL + "/buy-now",
            data:PaymentRequestDto,
            responseType: "json",
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          });
    }

}

export default new PaymentService()