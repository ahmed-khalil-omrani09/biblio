import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Navbar({ username, onLogout }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in before searching for books.");
      navigate("/inscri");
    } else {
      navigate("/emprunter"); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    if (onLogout) onLogout();
    alert("You have been logged out.");
    navigate("/");
  };

  return (
    <nav>
      <img src="/icon-logo.jpg" alt="logo" id="logo" />

      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
      </ul>

      <form onSubmit={handleSearch} id="searchForm">
        <input type="text" name="query" placeholder="Search..." required />
        <button type="submit">Search</button>
      </form>

      <div id="account-logout-container">
        {!isLoggedIn ? (
          <a href="/inscri" id="account-icon" title="Create an account">
            <img id="account-img" src="/iconinscri.png" alt="Account" />
          </a>
        ) : (
          <>
            <span
              id="username-display"
              style={{ marginLeft: "8px", fontWeight: "bold" }}
            >
              {username}
            </span>
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
