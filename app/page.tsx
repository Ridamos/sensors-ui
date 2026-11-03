import Link from "next/link";
import { API_URL } from "@/lib/api";

const sensors = [
  {
    href: "/dashboard-temp",
    title: "Давач температури 🌡️",
    text: "Графік температури в °C за даними із сервера.",
  },
  {
    href: "/dashboard-smoke",
    title: "Давач диму 💨",
    text: "Концентрація диму в ppm; тривогу визначає сервер за порогом.",
  },
];

export default function HomePage() {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Система моніторингу давачів</h1>
      <p className="mb-6 text-gray-700">
        Клієнтський застосунок на <strong>Next.js</strong> і{" "}
        <strong>Tailwind CSS</strong>. Показання давачів температури та диму він
        отримує від серверного застосунку на <strong>NestJS</strong> і показує
        їх у вигляді графіків, які оновлюються кожні кілька секунд. Клієнт
        розгортається на Vercel, сервер — на Render.
      </p>
      <p className="mb-8 text-gray-700 break-all">
        Адреса сервера (NEXT_PUBLIC_API_URL):{" "}
        <strong>{API_URL || "не задано"}</strong>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {sensors.map((sensor) => (
          <Link
            key={sensor.href}
            href={sensor.href}
            className="block bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:border-blue-500 transition-all"
          >
            <h2 className="text-lg font-semibold mb-2">{sensor.title}</h2>
            <p className="text-gray-600">{sensor.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
