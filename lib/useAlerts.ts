"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/api";

// Стан SSE-з'єднання:
//   connecting — браузер підключається або перепідключається після обриву;
//   open       — з'єднання відкрите, сервер може надсилати події;
//   off        — з'єднання немає і браузер більше не пробує (або не задано адресу).
export type StreamStatus = "connecting" | "open" | "off";

// Сповіщення плюс номер, який клієнт дає йому сам, — потрібен React як key у списку.
export type Received<T> = T & { key: number };

/**
 * Лаб. №6: підписка на сповіщення сервера через Server-Sent Events.
 * path  — SSE-маршрут API, наприклад "/temperature-sensors/alerts";
 * limit — скільки останніх сповіщень тримати на екрані.
 *
 * Звичайні дані сторінка й далі перечитує за таймером (useSensorData).
 * Тут навпаки: клієнт один раз відкриває з'єднання, а сервер сам пише в нього,
 * коли з'являється критичне показання.
 */
export function useAlerts<T>(path: string, limit = 5) {
  const [alerts, setAlerts] = useState<Received<T>[]>([]);
  const [status, setStatus] = useState<StreamStatus>(
    API_URL ? "connecting" : "off",
  );
  const counter = useRef(0);

  useEffect(() => {
    if (!API_URL) return;

    // EventSource — вбудований у браузер клієнт SSE. Він надсилає GET-запит
    // і тримає з'єднання відкритим.
    const eventSource = new EventSource(`${API_URL}${path}`);

    eventSource.onopen = () => setStatus("open");

    // Спрацьовує на кожну подію сервера. У event.data — рядок JSON
    // (об'єкт, який сервер поклав у поле data).
    eventSource.onmessage = (event) => {
      const alert: T = JSON.parse(event.data);
      counter.current += 1;
      const received = { ...alert, key: counter.current };
      // Нове сповіщення стає першим, у списку лишаються останні `limit`.
      // Форма (prev) => … бере актуальний список, навіть якщо дві події
      // прийшли одна за одною.
      setAlerts((prev) => [received, ...prev].slice(0, limit));
    };

    // Обрив з'єднання. eventSource.close() тут НЕ викликаємо: поки стан
    // CONNECTING, браузер сам перепідключається кожні кілька секунд.
    // CLOSED означає, що він здався (сервер відповів помилкою, а не потоком).
    eventSource.onerror = () => {
      setStatus(
        eventSource.readyState === EventSource.CLOSED ? "off" : "connecting",
      );
    };

    // Сторінку закрито або відкрито іншу — з'єднання більше не потрібне.
    // Коли на сторінку повернуться, ефект виконається знову і підключиться наново.
    return () => {
      eventSource.close();
      setStatus("connecting");
    };
  }, [path, limit]);

  const clear = useCallback(() => setAlerts([]), []);

  return { alerts, status, clear };
}
