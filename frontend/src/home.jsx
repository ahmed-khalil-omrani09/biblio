import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
    const [username, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
            setUsername(localStorage.getItem("username") || "");
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        alert("You have been logged out.");
        setUsername("");
        setIsLoggedIn(false); 
        navigate("/");
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (!localStorage.getItem("isLoggedIn")) {
            alert("Please log in before searching for books.");
            navigate("/inscription");
        } else {
            navigate("/emprunter");
        }
    };
    return (
    <div className="container">
        <div className="navbar">
            <img src="/icon-logo.jpg" alt="logo" id="logo" />
            <ul>
                <li ><a href="/">Home</a></li>
                <li><a href="/public/about">About</a></li>
                <li><a href="/public/contact">Contact</a></li>
                <li><a href="/public/terms">Terms of Service</a></li>
                <li><a href="/public/privacy">Privacy Policy</a></li>
            </ul>
            <form id="searchForm" onSubmit={(e) => {
                e.preventDefault();
                if (!localStorage.getItem("isLoggedIn")) {
                    alert("Please log in before searching for books.");
                    navigate("/inscri");
                } else {
                    navigate("/emprunter");
                }}}>
                    <input type="text" placeholder="Search..." required />
                    <button type="submit">Search</button>
            </form>

            <div id="account-logout-container">{isLoggedIn ? (
                <>
                <span style={{ marginLeft: "8px", fontWeight: "bold" }}>{username}</span>
                <button onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("username");
                    setIsLoggedIn(false);
                    setUsername("");
                    alert("You have been logged out.");
                    navigate("/");
                    }}style={{ marginLeft: "10px" }}>Logout
                </button>
                </>
                ) : (
                <Link to="/inscri" id="account-icon" title="Create an account">
                    <img id="account-img" src="/iconinscri.png" alt="Account" />
                </Link>                
            )}
            <Link to="#" onClick="logout()">Logout</Link>
            </div>
        </div>
        <main>
            <div className="left-section">
                <h1>WELCOME TO BIBLIOTHEQUE</h1>
                <h2>so many books, so little time</h2>
                <h3>Libraries <strong>store the energy that fuels the imagination</strong></h3>
                <p>Your one-stop destination for all your reading needs.</p>
            </div>        
            <div className="right-section">
                <div className="image-mask"></div>
                <img src="/bib3.jpg" alt="Library" />
                </div>
        </main>
        <footer>
            <p>&copy; 2025 Bibliotheque. All rights reserved. |{" "}
                <Link to="/terms">Terms of Service</Link> |{" "}
                <Link to="/privacy">Privacy Policy</Link>
            </p>
        </footer>
    </div>
    );
}

export default Home;
