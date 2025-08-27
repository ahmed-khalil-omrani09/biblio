import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inscri.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    mot_de_passe: "", // renamed to match backend field
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let errorMsg = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData.message) errorMsg = errorData.message;
        } catch {}

        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log("Login Success:", data);
      alert(data);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "username",
        data["utilisateur"]["nom"] || form.email
      );
      localStorage.setItem("userId", data["utilisateur"]["id"] || form.email);
      navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>LOGIN</legend>
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="mot_de_passe" // updated to match backend expected key
          placeholder="Mot de passe"
          required
          value={form.mot_de_passe}
          onChange={handleChange}
        />
        <br />
        <input type="submit" value="Se connecter" />
      </fieldset>
    </form>
  );
}

export default Login;
