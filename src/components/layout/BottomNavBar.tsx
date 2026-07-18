"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/library", label: "Library", icon: "library_books" },
    { href: "/import", label: "Import", icon: "publish" },
    { href: "/reader", label: "Reader", icon: "auto_stories" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-background/80 backdrop-blur-md border-t border-outline-variant/20 pb-safe">
      <div className="flex justify-around items-center h-16 px-xs">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all active:scale-90",
                isActive
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {link.icon}
              </span>
              <span className="font-label-sm text-label-sm">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
