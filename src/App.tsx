import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/front/HomePage";
import LoginPage from "./pages/auth/LoginPage";


const App: React.FC = () => {
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

    </Routes>
  </BrowserRouter>
}
export default App;