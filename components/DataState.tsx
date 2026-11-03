import { API_URL } from "@/lib/api";

interface DataStateProps {
  status: "loading" | "ready" | "error";
  error: string;
  empty: boolean;
  // Маршрут API, з якого сторінка бере дані, напр. "/temperature-sensors".
  path: string;
  children: React.ReactNode;
}

// Показує замість графіка пояснення, коли малювати нічого:
// дані ще завантажуються, сервер недоступний або масив на сервері порожній.
export default function DataState({
  status,
  error,
  empty,
  path,
  children,
}: DataStateProps) {
  if (status === "loading") {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-gray-600">
        <p className="font-medium">Завантаження даних…</p>
        <p className="mt-2 text-sm max-w-md">
          Сервер на безкоштовному плані Render засинає після 15 хвилин без
          запитів. Перший запит його будить — це триває до хвилини.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <p className="font-medium text-red-700">Не вдалося отримати дані</p>
        <p className="mt-2 text-sm text-gray-700 max-w-md">{error}</p>
        {API_URL && (
          <p className="mt-2 text-sm text-gray-600 break-all">
            Адреса запиту: {API_URL}
            {path}
          </p>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-gray-600">
        <p className="font-medium">На сервері ще немає показань</p>
        <p className="mt-2 text-sm max-w-md">
          Дані зберігаються в масиві в пам&apos;яті сервера й зникають після
          його перезапуску. Надішліть POST-запит із Postman або натисніть
          «Додати показання».
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
