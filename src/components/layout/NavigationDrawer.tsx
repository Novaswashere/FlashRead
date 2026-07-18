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
    { href: "/import", label: "Import", icon: "publish" },
    { href: "/reader", label: "Reader", icon: "auto_stories" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-30 transition-opacity duration-300"
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 z-[45] bg-surface-container-lowest border-r border-outline-variant text-on-surface flex flex-col pt-24 pb-lg gap-md transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header zone */}
        <div className="flex flex-col gap-sm">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-lg"
          >
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
              ReadPilot
            </span>
          </Link>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant px-lg">
            Menu
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 px-lg py-md rounded-lg transition-all duration-200 active:translate-x-1",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-primary rounded-full" />
                )}
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {link.icon}
                </span>
                <span className="font-body-md text-body-md">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer zone */}
        <div className="mt-auto flex flex-col gap-sm px-lg">
          <Link
            href="/import"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary rounded-lg px-lg py-md font-label-md text-label-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">publish</span>
            Import
          </Link>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            v0.1.0
          </span>
        </div>
      </aside>
    </>
  );
};
