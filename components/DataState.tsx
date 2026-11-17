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
// дані ще завантажуються, сервер недоступний або в базі ще немає записів.
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
          запитів. Перший запит його будить — це триває до хвилини. Показання
          при цьому не губляться: вони лежать у базі даних.
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
        <p className="font-medium">У базі даних ще немає показань</p>
        <p className="mt-2 text-sm max-w-md">
          Надішліть POST-запит із Postman, запустіть пристрій у Wokwi або
          натисніть «Додати показання». Запис потрапить у PostgreSQL і лишиться
          там після перезапуску сервера.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
