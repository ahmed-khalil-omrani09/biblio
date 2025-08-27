import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./emprunt.css";

function Emprunter() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id_utilisateur: "",
    id_livre: "",
    num_biblio: "",
    titre: "",
    date_emprunt: "",
    date_retour: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      id_utilisateur: form.id_utilisateur,
      id_livre: form.id_livre,
      num_biblio: form.num_biblio,
      titre: form.titre,
      date_emprunt: form.date_emprunt,
      date_remettre: form.date_retour,
    };

    try {
      const res = await fetch("/api/emprunter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      alert(json.message);
    } catch (err) {
      alert("Erreur lors de l'emprunt");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Borrow a book</legend>

        <label>ID USER*</label>
        <input
          type="text"
          name="id_utilisateur"
          value={form.id_utilisateur}
          onChange={handleChange}
          required
        />

        <label>ID Book</label>
        <input
          type="text"
          name="id_livre"
          value={form.id_livre}
          onChange={handleChange}
        />

        <label>NUM BIBLIOTHEQUE</label>
        <input
          type="text"
          name="num_biblio"
          value={form.num_biblio}
          onChange={handleChange}
        />

        <label>Titre*</label>
        <input
          type="text"
          name="titre"
          value={form.titre}
          onChange={handleChange}
          required
        />

        <label>Date Emprunt*</label>
        <input
          type="date"
          name="date_emprunt"
          value={form.date_emprunt}
          onChange={handleChange}
          required
        />

        <label>Date Retour*</label>
        <input
          type="date"
          name="date_retour"
          value={form.date_retour}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
        <button type="button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </fieldset>

      <button type="button" onClick={() => navigate("/exist")}>
        Livres disponible
      </button>
      <button type="button" onClick={() => navigate("/dispo")}>
        Toutes les livres
      </button>
    </form>
  );
}

export default Emprunter;
