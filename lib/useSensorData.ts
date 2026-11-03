"use client";

import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

type Status = "loading" | "ready" | "error";

/**
 * Отримує записи давача із сервера і періодично їх оновлює.
 * path       — маршрут API, наприклад "/temperature-sensors";
 * intervalMs — як часто повторювати запит.
 * У лаб. №2 на цьому місці був хук, що генерував випадкові числа в браузері.
 */
export function useSensorData<T>(path: string, intervalMs: number) {
  const [records, setRecords] = useState<T[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  // GET: забрати весь масив записів давача.
  const load = useCallback(async () => {
    if (!API_URL) {
      setError(
        "Не задано адресу сервера (NEXT_PUBLIC_API_URL). Локально: впишіть її у файл .env і перезапустіть npm run dev. На Vercel: Settings → Environment Variables, потім Redeploy.",
      );
      setStatus("error");
      return;
    }
    try {
      const res = await fetch(`${API_URL}${path}`);
      if (!res.ok) throw new Error(`Сервер відповів кодом ${res.status}`);
      const data: T[] = await res.json();
      setRecords(data);
      setUpdatedAt(new Date().toLocaleTimeString("uk-UA"));
      setError("");
      setStatus("ready");
    } catch (err) {
      console.error("Fetching data:", err);
      // «Failed to fetch» браузер пише і коли сервер недоступний, і коли відповідь заблоковано через CORS.
      setError(
        err instanceof TypeError
          ? "Немає зв'язку із сервером: він вимкнений, адреса в .env неправильна або на сервері не ввімкнено CORS."
          : (err as Error).message,
      );
      setStatus("error");
    }
  }, [path]);

  // POST: додати нове показання і одразу перечитати масив.
  const send = useCallback(
    async (body: object) => {
      try {
        const res = await fetch(`${API_URL}${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Сервер відповів кодом ${res.status}`);
      } catch (err) {
        console.error("Sending data:", err);
      }
      await load();
    },
    [path, load],
  );

  useEffect(() => {
    // Перший запит одразу, далі — за таймером. Таймер знімається, коли сторінку закрито.
    const first = setTimeout(load, 0);
    const interval = setInterval(load, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [load, intervalMs]);

  return { records, status, error, updatedAt, send };
}
