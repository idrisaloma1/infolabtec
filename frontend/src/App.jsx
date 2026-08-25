import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import ActivityDetail from "./pages/ActivityDetail.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import NextEvent from "./pages/NextEvent.jsx";
import Contact from "./pages/Contact.jsx";

import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout, { AdminGuard } from "./admin/AdminLayout.jsx";
import DashboardHome from "./admin/pages/DashboardHome.jsx";
import ManageActivities from "./admin/pages/ManageActivities.jsx";
import ManageProjects from "./admin/pages/ManageProjects.jsx";
import ManageEvents from "./admin/pages/ManageEvents.jsx";
import ManageGallery from "./admin/pages/ManageGallery.jsx";
import ManageMessages from "./admin/pages/ManageMessages.jsx";
import ManageStats from "./admin/pages/ManageStats.jsx";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/activities/:slug" element={<PublicLayout><ActivityDetail /></PublicLayout>} />
      <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
      <Route path="/portfolio/:id" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
      <Route path="/next-event" element={<PublicLayout><NextEvent /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="activities" element={<ManageActivities />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="messages" element={<ManageMessages />} />
        <Route path="stats" element={<ManageStats />} />
      </Route>
    </Routes>
  );
}
