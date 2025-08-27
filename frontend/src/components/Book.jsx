import { useState } from "react";

export default function Book({ book, isLogedIn }) {
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");
  if (!book) return null;

  const handleEmprunterClick = async () => {
    try {
      // Example data required for borrowing a book
      const borrowData = {
        id_utilisateur: userId,
        id_livre: book.identifiant,
        date_remettre: new Date().toISOString().split("T")[0],
      };

      const response = await fetch("http://localhost:8000/api/emprunter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(borrowData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(`Succès : Le livre "${book.titre}" a été emprunté.`);
      } else {
        setMessage(`Erreur : ${data.message || "Échec de l'emprunt."}`);
      }
    } catch (error) {
      setMessage("Erreur réseau lors de l'emprunt du livre.");
      console.error(error);
    }
  };

  return (
    <div className={book.disponible === 0 ? "blocked" : "book-item"}>
      <div className="book-category">{book.categorie}</div>
      <div className="book-title">{book.titre}</div>
      <div className="book-author">par {book.auteur}</div>
      {isLogedIn && (
        <button onClick={handleEmprunterClick} className="red-button">
          Emprunter
        </button>
      )}
      {message && <div className="emprunter-message">{message}</div>}
    </div>
  );
}
