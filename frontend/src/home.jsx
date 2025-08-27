import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import Book from "./components/Book";

function Home() {
  const [booksList, setBooksList] = useState([]); // useState for books loaded via API
  const [username, setUsername] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setUsername(localStorage.getItem("username") || "");
    }

    async function fetchBooks() {
      try {
        const response = await fetch("http://localhost:8000/api/livres");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data.success && Array.isArray(data.livres)) {
          setBooksList(data.livres);
        } else {
          setBooksList([]);
          console.warn("API response format unexpected");
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooksList([]);
      }
    }

    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setUsername("");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/inscription");
    } else {
      navigate("/emprunter");
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <img src="/icon-logo.jpg" alt="logo" id="logo" />
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/public/about">About</Link>
          </li>
          <li>
            <Link to="/public/contact">Contact</Link>
          </li>
          <li>
            <Link to="/public/terms">Terms of Service</Link>
          </li>
          <li>
            <Link to="/public/privacy">Privacy Policy</Link>
          </li>
        </ul>
        <form id="searchForm" onSubmit={handleSearch}>
          <input type="text" placeholder="Search..." required />
          <button type="submit">Search</button>
        </form>
        <div id="account-logout-container">
          {isLoggedIn ? (
            <>
              <span className="username">{username}</span>
              <button onClick={handleLogout} className="red-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="red-button">
                Login
              </Link>
              <Link to="/inscri" id="account-icon" title="Create an account">
                <img id="account-img" src="/iconinscri.png" alt="Account" />
              </Link>
            </>
          )}
        </div>
      </nav>

      <main>
        <section className="left-section">
          <h1>WELCOME TO BIBLIOTHEQUE</h1>
          <h2>so many books, so little time</h2>
          <h3>
            Libraries{" "}
            <strong>store the energy that fuels the imagination</strong>
          </h3>
          <p>Your one-stop destination for all your reading needs.</p>
        </section>

        <section className="book-list">
          {booksList.length > 0 ? (
            booksList.map((book) => (
              <Book key={book.identifiant} book={book} isLogedIn={isLoggedIn} />
            ))
          ) : (
            <p>Loading books...</p>
          )}
        </section>

        <section className="right-section">
          <div className="image-mask"></div>
          <img src="/bib3.jpg" alt="Library" />
        </section>
      </main>

      <footer>
        <p>
          &copy; 2025 Bibliotheque. All rights reserved. |{" "}
          <Link to="/public/terms">Terms of Service</Link> |{" "}
          <Link to="/public/privacy">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}

export default Home;
