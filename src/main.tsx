import "./assets/css/main.scss";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/front/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import SubjectIndexPage from "./pages/subject/SubjectIndexPage";
import SubjectCreatePage from "./pages/subject/SubjectCreatePage";
import SubjectEditPage from "./pages/subject/SubjectEditPage";
import SubjectShowPage from "./pages/subject/SubjectShowPage";
import CategoryIndexPage from "./pages/category/CategoryIndexPage";
import CategoryCreatePage from "./pages/category/CategoryCreatePage";
import CategoryEditPage from "./pages/category/CategoryEditPage";
import CategoryShowPage from "./pages/category/CategoryShowPage";
import BreakPointIndexPage from "./pages/break_point/BreakPointIndex";
import BreakPointCreatePage from "./pages/break_point/BreakPointCreatePage";
import BreakPointEditPage from "./pages/break_point/BreakPointEditPage";
import BreakPointShowPage from "./pages/break_point/BreakPointShowPage";
import UserIndexPage from "./pages/user/UserIndexPage";
import UserCreatePage from "./pages/user/UserCreatePage";
import UserEditPage from "./pages/user/UserEditPage";
import UserShowPage from "./pages/user/UserShowPage";
import ProfileSecurityPage from "./pages/user/ProfileSecurityPage";

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
        <Route path="/admin/subjects/create" element={<SubjectCreatePage />} />
        <Route path="/admin/subjects/:id/edit" element={<SubjectEditPage />} />
        <Route path="/admin/subjects/:id/show" element={<SubjectShowPage />} />
        <Route path="/admin/break_points" element={<BreakPointIndexPage />} />
        <Route path="/admin/break_points/create" element={<BreakPointCreatePage />} />
        <Route path="/admin/break_points/:id/edit" element={<BreakPointEditPage />} />
        <Route path="/admin/break_points/:id/show" element={<BreakPointShowPage />} />
        <Route path="/admin/users" element={<UserIndexPage />} />
        <Route path="/admin/users/create" element={<UserCreatePage />} />
        <Route path="/admin/users/:id/edit" element={<UserEditPage />} />
        <Route path="/admin/users/:id/show" element={<UserShowPage />} />
        <Route path="/admin/profile" element={<UserShowPage />} />
        <Route path="/admin/profile/edit" element={<UserEditPage />} />
        <Route path="/admin/profile/security" element={<ProfileSecurityPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
