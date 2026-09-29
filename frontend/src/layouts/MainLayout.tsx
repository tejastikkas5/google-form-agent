import { Outlet } from "react-router-dom";
import { Navbar } from "@components/common/Navbar";
import { Footer } from "@components/common/Footer";

/**
 * MainLayout wraps every public page with Navbar and Footer.
 * Renders child routes via <Outlet />.
 */
export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09091a]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
