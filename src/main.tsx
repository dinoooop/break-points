import "./assets/css/main.scss";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/front/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import SubjectIndexPage from "./pages/subject/SubjectIndexPage";
import CategoryIndexPage from "./pages/category/CategoryIndexPage";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/categories" element={<CategoryIndexPage />} />
        <Route path="/admin/subjects" element={<SubjectIndexPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
