"use client";

import { UserProvider } from "@/context/UserContext";
import UserHeader from "../components/Header/UserHeader";
import Footer from "../components/Header/Footer";
import Toastify from "@/app/components/Toastify/Toastify";


export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <UserProvider>
        <div className="UserContainer">
          <UserHeader />
          <div className="UserContent">
            <Toastify />
            {children}
          </div>
          <Footer />
        </div>
      </UserProvider>
  );
}
