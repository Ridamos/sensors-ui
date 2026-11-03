"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard-temp", label: "Temperature" },
  { href: "/dashboard-smoke", label: "Smoke" },
  { href: "/login", label: "Login" },
];

export default function Navbar() {
  // Поточний шлях у браузері — за ним підсвічуємо активне посилання.
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
      <h1 className="text-2xl font-bold text-blue-600">Sensors Dashboard</h1>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`${
                pathname === link.href
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              } transition-all`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
