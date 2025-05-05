// src/index.js
// pages/index.js
import Cotizacion from "../src/pages/Cotizacion.jsx";
export default Cotizacion;


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";             // Tailwind o tu CSS
import Layout from "./components/Layout.jsx";
import Cotizacion from "./pages/Cotizacion.jsx";
import Lista from "./pages/Lista.jsx";
import PreciosSidersa from "./pages/PreciosSidersa.jsx";
import Stock from "./pages/Stock.jsx";
import Trabajos from "./pages/Trabajos.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Cotizacion />} />
        <Route path="lista" element={<Lista />} />
        <Route path="sidersa" element={<PreciosSidersa />} />
        <Route path="stock" element={<Stock />} />
        <Route path="trabajos" element={<Trabajos />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
