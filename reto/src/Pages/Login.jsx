import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import "../styles/logo.css";

export default function LoginPage() {
  const API_BACK = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [hasPassword, setHasPassword] = useState(null);
  const [pass, setPass] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Verificar si el token ya está en localStorage y redirigir si es necesario
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home");  // Redirige a /home si ya está logueado
    }
  }, [navigate]);

  const handleNoPassword = async () => {
    setError(null);
    setInfoMessage(""); 

    if (!email || email.trim() === "") {
      setError("Please enter a valid email.");
      return;
    }

    try {
      await axios.post(`${API_BACK}/employees/login`, {
        email,
        pass: "",
      });
      setHasPassword(false);
      setInfoMessage("Please enter the OTP code you received and set your new password.");
    } catch (err) {
      console.error("Password-less login error:", err);
      setError("Login error. Please try again.");
    }
  };


  const handleLogin = async () => {
    setError(null);
    setInfoMessage(""); 
    setLoading(true);
    try {
      const response = await axios.post(`${API_BACK}/employees/login`, {
        email,
        pass
      });

      const { token, level } = response.data;
      localStorage.setItem("authToken", token);  // Asegurarse de guardar el token
      localStorage.setItem("userLevel", level.name);

      const nameResponse = await axios.get(`${API_BACK}/employees/`, {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (nameResponse.data && nameResponse.data.name) {
        localStorage.setItem("userName", nameResponse.data.name);
      }

      navigate("/home");  // Redirigir a /home después de iniciar sesión
    } catch (err) {
      console.error("Login error:", err);
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError(null);
    setInfoMessage(""); 
    try {
      const response = await axios.post(`${API_BACK}/employees/signup`, {
        email,
        otp,
        pass: newPass,
      });

      if (response.data.msg === "Employee password setted") {
        setInfoMessage("Password set successfully. You can now log in.");
        setHasPassword(true);
        setOtp("");
        setNewPass("");
        setError(null);
      } else {
        setError("Error setting password. Please verify the OTP and try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Registration error. Please try again.");
    }
  };

  return (
    <div className="d-flex vh-100 login-container">
      <div className="d-flex flex-column justify-content-center align-items-center bg-white p-5 login-form-container">
        <div className="text-center mb-4">
          <img
            src="img/Logo.png"
            className="mb-4 logo-animation"
            style={{ height: "120px" }}
            alt="Company Logo"
          />
        </div>

        <div className="w-100" style={{ maxWidth: "400px" }}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label small text-uppercase text-muted">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className="form-control mb-1 purple-input py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {hasPassword === null && (
            <div className="mb-4 text-center">
              <p className="mb-3 text-muted">Do you have an existing password?</p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  type="button"
                  className="btn px-4 purple-outline-btn rounded-pill"
                  onClick={() => {setHasPassword(true);
                                 setError(null);
                  }
                  }
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn px-4 purple-outline-btn rounded-pill"
                  onClick={handleNoPassword}
                >
                  No
                </button>
              </div>
            </div>
          )}

          {hasPassword === true && (
            <>
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label
                    htmlFor="password"
                    className="form-label small text-uppercase text-muted"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="form-control purple-input py-2"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn w-100 py-2 mb-3 purple-btn rounded-pill shadow-sm"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Loading..." : "Log in"}
              </button>
            </>
          )}

          {hasPassword === false && (
            <>
              <div className="mb-4">
                <label htmlFor="otp" className="form-label small text-uppercase text-muted">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="form-control mb-3 purple-input py-2"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPass" className="form-label small text-uppercase text-muted">
                  New Password
                </label>
                <input
                  id="newPass"
                  type="password"
                  placeholder="Create your password"
                  className="form-control mb-3 purple-input py-2"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn w-100 py-2 purple-btn rounded-pill shadow-sm"
                onClick={handleSignup}
              >
                Continue
              </button>
            </>
          )}

          {error && (
            <div className="alert alert-danger mt-4 purple-alert text-center small">
              {error}
            </div>
          )}
          {infoMessage && (
            <div className="alert alert-info mt-4 purple-alert text-center small">
              {infoMessage}
            </div>
          )}
        </div>
      </div>

      <div
        className="login-image-container position-relative"
        style={{ backgroundImage: 'url("img/login_img.png")' }}
      >
        <div className="position-absolute bottom-0 start-0 p-4 text-white">
          <h4>Horizons</h4>
          <p className="small opacity-75">Your journey begins here</p>
        </div>
      </div>
    </div>
  );
}
