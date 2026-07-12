"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import AppSidebar from "@/components/layout/AppSidebar";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950/90 text-white shadow-lg backdrop-blur md:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Dark page overlay */}
      <button
        type="button"
        onClick={closeMenu}
        aria-label="Close navigation menu"
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sliding sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar onNavigate={closeMenu} />

        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close navigation menu"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          <X size={22} />
        </button>
      </div>
    </>
  );
}