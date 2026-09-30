import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@layouts/MainLayout";
import {
  HomePage,
  AboutPage,
  DashboardPage,
  FormsPage,
  LoginPage,
  NotFoundPage,
  PrivacyPage,
} from "@pages/index";

/**
 * Root application component.
 * Configures React Router with a layout wrapper and all page routes.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All public routes share the MainLayout (Navbar + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        {/* 404 — also inside layout so Navbar is visible */}
        <Route
          path="*"
          element={
            <MainLayout />
          }
        >
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
