import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  faInfoCircle,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Registration.css";
import CustomerService from "../../services/CustomerService";
import AuthService from "../../services/AuthService";
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\d{10}$/;
//const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!=.*[!@#$%]]).{6,24}$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!=.*!@#$%_]).{8,24}$/;

export const CustomerRegistration = () => {
  //allows to focus on error user input
  const userNameRef = useRef();
  //allows to focus on error
  const errorRef = useRef();
  //username textbox
  const [userName, setusername] = useState("");
  const [validName, setValidName] = useState(false);
  //valid username regex result
  const [emailId, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [address, setAddress] = useState("");

  const [phoneNumber, setPhoneNumber] = useState();
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);

  const [paymentMode, setPaymentMode] = useState("");
  //focusing on username textbox
  const [userNameFocus, setUserNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
  //password textbox
  const [password, setPassword] = useState("");
  //valid password regex result
  const [validPassword, setValidPassword] = useState(false);
  //focusing on password textbox
  const [passwordFocus, setPasswordFocus] = useState(false);
  //confirmPassword textbox
  const [confirmPassword, setConfirmPassword] = useState("");
  //result of match between password and confirm password
  const [validMatch, setValidMatch] = useState(false);
  //focusing on password textbox
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  //error message
  const [error, setError] = useState("");
  //success message
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { email } = useParams();

  useEffect(() => {
    userNameRef.current.focus();
    console.log("first useeffect fired...Userref set focus .....");
    if (email) {
      console.log("email received from url " + email);
      CustomerService.getCustomerByEmail(email).then((response) => {
        setusername(response.data.user_name);
        setAddress(response.data.address);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phone_number);
        setPaymentMode(response.data.paymentMode);
      });
    }
  }, []);
  useEffect(() => {
    console.log(
      "second useffect fired beacuse of intitial mount or userName state variable changed"
    );
    const result = USER_REGEX.test(userName);
    console.log("Result of username valid :" + result);
    setValidName(result);
    console.log(
      "State variable validName assigned with result of regex :" + result
    );
  }, [userName]);
  useEffect(() => {
    console.log(
      "third useffect fired beacuse of intitial mount or emailId state variable changed"
    );
    const result = EMAIL_REGEX.test(emailId);
    console.log("Result of emailId valid :" + result);
    setValidEmail(result);
    console.log(
      "State variable validEmail assigned with result of regex :" + result
    );
  }, [emailId]);
  useEffect(() => {
    console.log(
      "fourth useffect fired beacuse of intitial mount or phoneNumber state variable changed"
    );
    const result = PHONE_REGEX.test(phoneNumber);
    console.log("Result of phoneNumber valid :" + result);
    setValidPhoneNumber(result);
    console.log(
      "State variable validPhoneNumber assigned with result of regex :" + result
    );
  }, [phoneNumber]);
  useEffect(() => {
    console.log(
      "fifth useffect fired beacuse of intitial mount or password/matchPwd state variable changed"
    );
    const result = PWD_REGEX.test(password);
    console.log("Result of password valid :" + result);
    setValidPassword(result);
    console.log(
      "State variable validPassword assigned with result of regex :" + result
    );
    const matchResult = password === confirmPassword;
    setValidMatch(matchResult);
    console.log(
      "State variable validMatch assighed with result of match btwn pwd & confirmpwd: " +
        matchResult
    );
  }, [password, confirmPassword]);
  useEffect(() => {
    console.log(
      "Sixth useEffect fired beacuse of intitial mount or user password, confirmPassword state variable changed"
    );
    setError("");
    console.log("status variable error set with empty string");
  }, [userName, password, confirmPassword]);

  const saveUserRegistration = (e) => {
    console.log(
      "saveUserRegistration function of Customer Registration called..."
    );
    e.preventDefault();
    console.log("Prevent default behavior of form submission...");
    const userRole = "Customer";
    const customerRegistrationobj = {
      user_name: userName,
      address: address,
      phone_number: phoneNumber,
      email: emailId,
      paymentMode: paymentMode,
      userRole: userRole,
      password: password,
    };

    AuthService.registerCustomer(customerRegistrationobj)
      .then((response) => {
        console.log(
          "response received from register API" + JSON.stringify(response.data)
        );

        if (response) {
          setSuccess(true);
          console.log("Success message set to true...");
          toast.success("Registration Successful!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      })
      .catch((error) => {
        console.log("error from register api: " + error);
        if (!error?.response) {
          setError("No server Response");
        } else if (error.response?.status === 409) {
          setError("emailId already used");
        } else {
          setError("Registration failed");
        }
      });
  };

  return (
    <div className="container-fluid" id="background">
      <ToastContainer />
      <section className="mysection">
        <p
          ref={errorRef}
          className={error ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {error}
        </p>
        <h3>Register Customer</h3>
        <form action="" className="myform">
          {/* Split form into two columns */}
          <div>
            {/* USERNAME */}
            <label htmlFor="username">
              User Name{" "}
              <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validName || !userName ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="reginput"
              type="text"
              id="username"
              ref={userNameRef}
              autoComplete="off"
              onChange={(e) => setusername(e.target.value)}
              value={userName}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserNameFocus(true)}
              onBlur={() => setUserNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userNameFocus && userName && !validName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 chars, can contain _ Underscore
              <br />
              Must begin with a letter
            </p>
            {/* EMAIL */}
            <label htmlFor="emailId">
              Email{" "}
              <span className={validEmail ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validEmail || !emailId ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="reginput"
              type="text"
              id="emailId"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={emailId}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="uidnote"
              className={
                emailFocus && emailId && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be a valid emailId format: <br />
              Example: name@example.com
            </p>
            {/* PHONE NUMBER */}
            <label htmlFor="phone">
              Phone Number{" "}
              <span className={validPhoneNumber ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={
                  validPhoneNumber || !phoneNumber ? "hide" : "invalid"
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="reginput"
              type="text"
              id="phone"
              autoComplete="off"
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              required
              aria-invalid={validPhoneNumber ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setPhoneNumberFocus(true)}
              onBlur={() => setPhoneNumberFocus(false)}
            />
            <p
              id="uidnote"
              className={
                phoneNumberFocus && phoneNumber && !validPhoneNumber
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be a valid Phone Number: <br />
              Must be a 10 digit value: avoid country code
            </p>
            {/* ADDRESS */}
            <label htmlFor="address">Address</label>
            <input
              className="reginput"
              type="text"
              id="address"
              autoComplete="off"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              required
              aria-describedby="uidnote"
            />{" "}
          </div>
          <div>
            {/* PAYMENT MODE */}
            <label htmlFor="payment">Preferred Payment Mode</label>
            <select
              className="reginput"
              id="payment"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="">Choose...</option>
              <option value="UPI">UPI</option>
              <option value="NetBanking">NetBanking</option>
              <option value="CreditCard">Credit Card</option>
            </select>
            {/* PASSWORD */}
            <label htmlFor="password">
              Password{" "}
              <span className={validPassword ? " valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPassword || !password ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="reginput"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              aria-invalid={validPassword ? "false" : "true"}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id="uidnote"
              className={
                passwordFocus && !validPassword ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters <br />
              Must include upper and lowercase letters, a number, and a special
              character.
            </p>

            {/* CONFIRM PASSWORD */}
            <label htmlFor="confirm_pwd">
              Confirm Password{" "}
              <span
                className={validMatch && confirmPassword ? " valid" : "hide"}
              >
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validMatch || !confirmPassword ? "hide" : "invalid"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="reginput"
              type="password"
              id="confirm_pwd"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              aria-invalid={validMatch ? "false" : "true"}
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
            />
            <p
              id="uidnote"
              className={
                confirmPasswordFocus && !validMatch
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password.
            </p>

            {/* SUBMIT BUTTON */}
            <button
              className="regbtn"
              onClick={saveUserRegistration}
              disabled={
                !validName ||
                !validEmail ||
                !validPhoneNumber ||
                !validPassword ||
                !validMatch
              }
            >
              Sign Up
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
