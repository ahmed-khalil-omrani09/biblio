import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inscri.css";

function Inscription() {
  const [form, setForm] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    password: "",
    confirm_password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/utilisateur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          tel: form.tel,
          password: form.password
        })
      });

      if (!res.ok) {
        throw new Error("Erreur d'inscription");
      }

      const data = await res.json();
      console.log("Réponse API:", data);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", form.nom + " " + form.prenom);

      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      alert("Erreur lors de l'inscription");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>INSCRIPTION</legend>
        <input type="text" name="id" placeholder="ID" required onChange={handleChange} />
        <br />
        <input type="text" name="nom" placeholder="Nom" required onChange={handleChange} />
        <br/>
        <input type="text" name="prenom" placeholder="Prenom" required onChange={handleChange} />
        <br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <br />
        <input type="tel" name="tel" placeholder="Telephone" onChange={handleChange} />
        <br />
        <input type="password" name="password" placeholder="Mot de passe" required onChange={handleChange} />
        <br />
        <input type="password" name="confirm_password" placeholder="Confirmer Mot de passe" required onChange={handleChange} />
        <br />
        <input type="submit" value="Connecter" />
      </fieldset>
    </form>
  );
}

export default Inscription;
