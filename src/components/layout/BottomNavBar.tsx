import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/library", label: "Library", icon: "library_books" },
    { href: "/import", label: "Import", icon: "add_circle" },
    { href: "/reader", label: "Reader", icon: "bolt" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface/85 dark:bg-surface-dark/85 backdrop-blur-md border-t border-border-subtle dark:border-outline-variant pb-safe">
      <div className="flex justify-around items-center h-16 px-space-md">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center text-on-surface-variant dark:text-outline hover:text-primary transition-all active:scale-90",
                isActive && "text-primary dark:text-primary-fixed font-bold"
              )}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {link.icon}
              </span>
              <span className="font-label-mono text-[10px] mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
