import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Inscription from "./inscri";
import Emprunter from "./emprunter";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscri" element={<Inscription />} />
        <Route path="/emprunter" element={<Emprunter />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
