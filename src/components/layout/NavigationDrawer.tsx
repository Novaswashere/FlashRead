"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutContext } from "@/providers/LayoutProvider";
import { cn } from "@/lib/utils";

export const NavigationDrawer: React.FC = () => {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useLayoutContext();

  const links = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/library", label: "Library", icon: "library_books" },
    { href: "/import", label: "Import", icon: "add_circle" },
    { href: "/reader", label: "Reader", icon: "bolt" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/45 backdrop-blur-sm z-30 transition-opacity duration-300"
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 z-[45] bg-surface-container-low dark:bg-surface-dark border-r border-border-subtle dark:border-outline-variant flex flex-col p-space-lg pt-24 gap-space-sm transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileMenuOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-outline hover:bg-surface-container-high dark:hover:bg-surface-container-highest rounded-xl transition-all duration-200 active:translate-x-1",
                  isActive &&
                    "bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
                )}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
