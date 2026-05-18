"use client";

import { AdminProvider } from "@/context/AdminContext";
import AdminHeader from "../components/Header/AdminHeader";
import Footer from "../components/Header/Footer";
import { ProtectedRoute } from "@/services/ProtectedRoute";
import Toastify from "@/app/components/Toastify/Toastify";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminProvider>
        <div className="admin-container">
          <AdminHeader />
          <div className="admin-content">
            <Toastify />
            {children}
          </div>
          <Footer />
        </div>
      </AdminProvider>
    </ProtectedRoute>
  );
}
