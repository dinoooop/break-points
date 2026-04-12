import "./assets/css/main.scss";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/front/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import SubjectIndexPage from "./pages/subject/SubjectIndexPage";
import CategoryIndexPage from "./pages/category/CategoryIndexPage";
import CategoryCreatePage from "./pages/category/CategoryCreatePage";
import CategoryEditPage from "./pages/category/CategoryEditPage";
import CategoryShowPage from "./pages/category/CategoryShowPage";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/categories" element={<CategoryIndexPage />} />
        <Route path="/admin/categories/create" element={<CategoryCreatePage />} />
        <Route path="/admin/categories/:id/edit" element={<CategoryEditPage />} />
        <Route path="/admin/categories/:id/show" element={<CategoryShowPage />} />
        <Route path="/admin/subjects" element={<SubjectIndexPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
