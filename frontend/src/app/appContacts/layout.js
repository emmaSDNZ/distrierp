"use client"
import React from "react";
import ContactsNavBar from "./components/ContactsNavBar";
import { ApiUserProvider } from "@/shared/context/UserContext";


export default function ContactsLayout({ children }) {
  return (

        <ApiUserProvider> 
        <div className="flex flex-col h-screen">
          <ContactsNavBar/>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        </ApiUserProvider>
        
  );
}