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
import AuthService from "../../services/AuthService";
import SellerService from "../../services/SellerService";
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\d{10}$/;
const ACCOUNT_NUMBER_REGEX = /^\d{7,}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!=.*!@#$%_]).{8,24}$/;

export const SellerRegistration = () => {
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

  const [storeName, setStoreName] = useState("");
  const [accountNumber, setAccountNumber] = useState();
  const [validAccountNumber, setValidAccountNumber] = useState(false);
  const [ifscCode, setIfscCode] = useState("");
  const [validIfscCode, setValidIfscCode] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [validGstNumber, setValidGstNumber] = useState(false);
  const [shippingMode, setShippingMode] = useState("");
  //focusing on username textbox
  const [userNameFocus, setUserNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
  const [accountNumberFocus, setAccountNumberFocus] = useState(false);
  const [ifscCodeFocus, setIfscCodeFocus] = useState(false);
  const [gstNumberFocus, setGstNumberFocus] = useState(false);
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
      SellerService.getSellerByEmail(email).then((response) => {
        setusername(response.data.user_name);
        setAddress(response.data.address);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phone_number);
        setStoreName(response.data.store_name);
        setAccountNumber(response.data.account_number);
        setIfscCode(response.data.ifsc_code);
        setGstNumber(response.data.gst_number);
        setShippingMode(response.data.shippingMode);
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
      "fifth useffect fired beacuse of intitial mount or accountNumber state variable changed"
    );
    const result = ACCOUNT_NUMBER_REGEX.test(accountNumber);
    console.log("Result of accountNumber valid :" + result);
    setValidAccountNumber(result);
    console.log(
      "State variable validAccountNumber assigned with result of regex :" +
        result
    );
  }, [accountNumber]);
  useEffect(() => {
    console.log(
      "sixth useffect fired beacuse of intitial mount or GstNumber state variable changed"
    );
    const result = GST_REGEX.test(gstNumber);
    console.log("Result of gstNumber valid :" + result);
    setValidGstNumber(result);
    console.log(
      "State variable validGstNumber assigned with result of regex :" + result
    );
  }, [gstNumber]);
  useEffect(() => {
    console.log(
      "seventh useffect fired beacuse of intitial mount or password/matchPwd state variable changed"
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
      "8th useEffect fired beacuse of intitial mount or user password, confirmPassword state variable changed"
    );
    setError("");
    console.log("status variable error set with empty string");
  }, [userName, password, confirmPassword]);
  useEffect(() => {
    setValidIfscCode(IFSC_REGEX.test(ifscCode)); // Validate IFSC code
  }, [ifscCode]);
  const saveUserRegistration = (e) => {
    console.log(
      "saveUserRegistration function of Seller Registration called..."
    );
    e.preventDefault();
    console.log("Prevent default behavior of form submission...");
    const userRole = "Seller";
    const sellerRegistrationobj = {
      user_name: userName,
      address: address,
      phone_number: phoneNumber,
      email: emailId,
      userRole: userRole,
      store_name: storeName,
      account_number: accountNumber,
      ifsc_code: ifscCode,
      gst_number: gstNumber,
      shippingMode: shippingMode,
    };
    if (password) {
      sellerRegistrationobj.password = password;
    }
    if (email) {
      console.log("email received from url" + email);
      SellerService.updateSeller(sellerRegistrationobj, email)
        .then((response) => {
          console.log(
            "response from updateSeller() api" + JSON.stringify(response.data)
          );
          navigate("/login");
        })
        .catch((error) => {
          console.log("error from API findSellerByEmail" + error);
        });
    } else {
      AuthService.registerSeller(sellerRegistrationobj)
        .then((response) => {
          console.log(
            "response received from register API" +
              JSON.stringify(response.data)
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
          if (error.response) {
            console.error("Error data:", error.response.data);
            console.error("Error status:", error.response.status);
            console.error("Error headers:", error.response.headers);
          } else if (error.request) {
            console.error(
              "Request made but no response received:",
              error.request
            );
          } else {
            console.error("Error", error.message);
          }
        });
    }
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
          {MediaError}
        </p>
        <h3>Register Seller</h3>
        <form action="" className="myform">
          <div>
            {/* USERNAME */}
            <label htmlFor="username">
              User Name{" "}
              <span className={validName ? " valid" : "hide"}>
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
              onChange={(e) => {
                setusername(e.target.value);
              }}
              value={userName}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => {
                setUserNameFocus(true);
              }}
              onBlur={() => {
                setUserNameFocus(false);
              }}
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
              4 to 24 chars <br />
              Must begin with a letter
            </p>

            {/* emailId */}
            <label htmlFor="emailId">
              email{" "}
              <span className={validEmail ? " valid" : "hide"}>
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
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={emailId}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => {
                setEmailFocus(true);
              }}
              onBlur={() => {
                setEmailFocus(false);
              }}
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
              <span className={validPhoneNumber ? " valid" : "hide"}>
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
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              value={phoneNumber}
              required
              aria-invalid={validPhoneNumber ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => {
                setPhoneNumberFocus(true);
              }}
              onBlur={() => {
                setPhoneNumberFocus(false);
              }}
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
              Must be a 10 digit value : avoid country code
            </p>

            {/* STORE NAME */}
            <label htmlFor="storeName">Store Name </label>
            <input
              className="reginput"
              type="text"
              id="storeName"
              autoComplete="off"
              onChange={(e) => {
                setStoreName(e.target.value);
              }}
              value={storeName}
              required
            />

            {/* ADDRESS */}
            <label htmlFor="address">Address </label>
            <input
              className="reginput"
              type="text"
              id="address"
              autoComplete="off"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              value={address}
              required
            />
            {/* SHIPPING MODE */}
            <label htmlFor="shipping">Preferred Shipping Mode </label>
            <select
              className="form-control reginput"
              id="shipping"
              value={shippingMode}
              onChange={(e) => setShippingMode(e.target.value)}
            >
              <option value="">Choose...</option>
              <option value="Self_Ship_Fulfillment">
                Self_Ship_Fulfillment
              </option>
              <option value="Flipkart_Fulfillment">Flipkart_Fulfillment</option>
            </select>
          </div>
          <div>
            {/* Account Number */}
            <label htmlFor="accountNumber">
              Account Number{" "}
              <span className={validAccountNumber ? " valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={
                  validAccountNumber || !accountNumber ? "hide" : "invalid"
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="reginput"
              type="text"
              id="accountNumber"
              autoComplete="off"
              onChange={(e) => {
                setAccountNumber(e.target.value);
              }}
              value={accountNumber}
              required
              aria-invalid={validAccountNumber ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => {
                setAccountNumberFocus(true);
              }}
              onBlur={() => {
                setAccountNumberFocus(false);
              }}
            />
            <p
              id="uidnote"
              className={
                accountNumberFocus && accountNumber && !validAccountNumber
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be a valid Account Number: <br />
              Atleast 7 digits
            </p>

            {/* IFSC Code */}
            {/* IFSC CODE */}
            <label htmlFor="ifscCode">
              IFSC Code{" "}
              <span className={validIfscCode ? " valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validIfscCode || !ifscCode ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="reginput"
              type="text"
              id="ifscCode"
              onChange={(e) => setIfscCode(e.target.value)}
              value={ifscCode}
              required
              aria-invalid={validIfscCode ? "false" : "true"}
              aria-describedby="ifsccodenote"
              onFocus={() => setIfscCodeFocus(true)}
              onBlur={() => setIfscCodeFocus(false)}
            />
            <p
              id="ifsccodenote"
              className={
                ifscCodeFocus && ifscCode && !validIfscCode
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be 11 characters: 4 letters + 0 + 6 letters/digits.
            </p>

            {/* GST Number */}
            <label htmlFor="gstNumber">
              GST Number{" "}
              <span className={validGstNumber ? " valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validGstNumber || !gstNumber ? "hide" : "invalid"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="reginput"
              type="text"
              id="gstNumber"
              autoComplete="off"
              onChange={(e) => {
                setGstNumber(e.target.value);
              }}
              value={gstNumber}
              required
              aria-invalid={validGstNumber ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => {
                setGstNumberFocus(true);
              }}
              onBlur={() => {
                setGstNumberFocus(false);
              }}
            />
            <p
              id="uidnote"
              className={
                gstNumberFocus && gstNumber && !validGstNumber
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be a valid GST Number: <br />
              - Starts with 2 digits followed by 5 capital letters, <br />- Then
              4 digits, 1 capital letter, 1 alphanumeric character, <br />-
              Followed by "Z" and 1 alphanumeric character.
            </p>

            {/* PASSWORD */}
            <label htmlFor="password">
              Password{" "}
              <FontAwesomeIcon
                icon={faCheck}
                className={validPassword ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPassword || !password ? "hide" : "invalid"}
              />
            </label>
            <input
              className="reginput"
              type="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => {
                setPasswordFocus(true);
              }}
              onBlur={() => {
                setPasswordFocus(false);
              }}
            />
            <p
              id="pwdnote"
              className={
                passwordFocus && !validPassword ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 chars
              <br />
              Must include uppercase & lowercase letters,a number & special
              symbol
              <br />
              Allowed special characters:
              <span aria-label="exclamation mark">!</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span>
              <span aria-label="percent">%</span>
              <span aria-label="underscore">_</span>
            </p>
            {/*CONFIRM PASSWORD */}
            <label htmlFor="confirm-password">
              Confirm Password{" "}
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && confirmPassword ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !confirmPassword ? "hide" : "invalid"}
              />
            </label>
            <input
              className="reginput"
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => {
                setConfirmPasswordFocus(true);
              }}
              onBlur={() => {
                setConfirmPasswordFocus(false);
              }}
            />
            <p
              id="confirmnote"
              className={
                !validMatch && confirmPasswordFocus
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match first password input field
            </p>
            <button
              className="regbtn"
              disabled={
                !validName ||
                !validEmail ||
                !validPhoneNumber ||
                !validAccountNumber ||
                !validGstNumber ||
                !validPassword ||
                !validMatch
                  ? true
                  : false
              }
              onClick={(e) => {
                saveUserRegistration(e);
              }}
            >
              Sign Up
            </button>
            <br />
            <p>
              Already registered? &nbsp;
              <span className="line">
                <Link className="btn-primary regbtn" to="/login">
                  Log In
                </Link>
              </span>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};
