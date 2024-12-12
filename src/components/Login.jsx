import React, { useContext, useEffect, useRef, useState } from "react";
import "../css/Login.css";
import AuthService from "../services/AuthService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import loginImage from "../images/loginbg.png";

export const Login = () => {
  const userRef = useRef();
  const errorRef = useRef();
  const [email, setEmail] = React.useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    console.log("First useeffect fired.Userref is set...");
    userRef.current.focus();
  }, []);
  useEffect(() => {
    console.log("Second useeffect fired.Userref is set...");
    setError("");
  }, [email, password]);
  useEffect(() => {
    console.log(
      "third useffect fired beacuse of intitial mount or email state variable changed"
    );
    const result = EMAIL_REGEX.test(email);
    console.log("Result of email valid :" + result);
    setValidEmail(result);
    console.log(
      "State variable validEmail assigned with result of regex :" + result
    );
  }, [email]);

  const saveUserLogin = (e) => {
    console.log("saveUserLogin function called...");
    e.preventDefault();
    console.log("Prevent default behavior of form submission...");

    const userLoginobj = { email: email, password: password };
    AuthService.loginUser(userLoginobj)
      .then((response) => {
        const token = response.data.accessToken;
        const username = response.data.user_name;
        console.log("Bearer token: " + token);
        console.log("Username: " + username);
        console.log("Email: " + response.data.email);
        console.log("user id: " + response.data.id);
        setAuth({
          user_name: response.data.user_name,
          email: response.data.email,
          token: response.data.accessToken,
          userRole: response.data.userRole,
          id: response.data.id,
        });
        console.log("Auth set to: ", { auth });
        console.log(
          "Auth context variable is with values for username, email token, role...."
        );
        setSuccess(true);
        console.log("Success message set to true...");
        console.log(
          "from value saved from uselocation(): " + JSON.stringify(from)
        );
        if (response.data.userRole == "Customer") {
          navigate("/customer");
        } else if (response.data.userRole == "Seller") {
          navigate("/seller");
        } else if (response.data.userRole == "Admin") {
          navigate("/admin");
        }
      })
      .catch((error) => {
        console.log("Error response:", error);
        if (!error?.response) {
          setError("No server response");
        } else if (error.response?.status === 401) {
          setError("Unauthorized. Please check your credentials.");
        } else if (error.response?.status === 500) {
          setError("Internal Server Error. Please try again later.");
        } else {
          setError(error.response?.data?.message || "Login failed");
        }
      });
  };
  return (
    <div id="login-container">
      <div>
        <img src={loginImage} className="login-image" />
      </div>
      <div className="login-content">
        <div className="login-form-container">
          <section className="form-section">
            <p ref={errorRef} className={error ? "errmsg" : "offscreen"}>
              {error}
            </p>
            <center>
              <h2 className="loginheading">Sign In</h2>
            </center>
            <form onSubmit={saveUserLogin}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                ref={userRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <center>
                <button
                  className="loginbtn"
                  type="submit"
                  disabled={!validEmail}
                >
                  Sign In
                </button>
              </center>
            </form>
            <p class="text-center">
              Need an account? <Link to="/customer/register">Sign Up</Link>
            </p>
            <p class="text-center">
              Register as seller <Link to="/seller/register">Sign Up</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
