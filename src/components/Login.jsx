import React, { useContext, useEffect, useRef, useState } from "react";
import "../css/Login.css";
import AuthService from "../services/AuthService";
import CustomerService from "../services/CustomerService";
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
  const { setCurrentTierStatus } = useContext(AuthContext); // Access TierContext
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
  useEffect(() => {
    userRef.current.focus();
  }, []);
 
  useEffect(() => {
    setError("");
  }, [email, password]);
 
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);
 
  const saveUserLogin = (e) => {
    e.preventDefault();
    const userLoginobj = { email: email, password: password };
    AuthService.loginUser(userLoginobj)
      .then((response) => {
        const token = response.data.accessToken;
        const username = response.data.user_name;
        setAuth({
          user_name: response.data.user_name,
          email: response.data.email,
          token: response.data.accessToken,
          userRole: response.data.userRole,
          id: response.data.id,
        });
        setSuccess(true);
        // Fetch the tier after login
        CustomerService.getTiersByEmail(email, token)
          .then((tierResponse) => {
            setCurrentTierStatus(tierResponse.data)
            console.log("User's tier status:", tierResponse);
            // Navigate based on role
            if (response.data.userRole === "Customer") {
              navigate("/customer");
            } else if (response.data.userRole === "Seller") {
              navigate("/seller");
            } else if (response.data.userRole === "Admin") {
              navigate("/admin");
            }
          })
          .catch((tierError) => {
            console.error("Failed to fetch tier:", tierError);
            setError("Failed to fetch user tier. Please try again.");
          });
      })
      .catch((error) => {
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
<img src={loginImage} className="login-image" alt="Login" />
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
<p className="text-center">

              Need an account? <Link to="/customer/register">Sign Up</Link>
</p>
<p className="text-center">

              Register as seller <Link to="/seller/register">Sign Up</Link>
</p>
</section>
</div>
</div>
</div>

  );

};