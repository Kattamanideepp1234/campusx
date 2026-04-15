import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const MainLayout = () => (
  <div className="min-h-screen bg-hero text-white">
    <div className="absolute inset-0 grid-lines opacity-20" />
    <div className="relative z-10">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
);

export default MainLayout;
