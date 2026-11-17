import type { StreamStatus } from "@/lib/useAlerts";

// Одне сповіщення у вигляді, готовому до показу.
export interface AlertItem {
  key: number;
  message: string; // текст від сервера: «Critical temperature! Value -15 C»
  source: string; // звідки: назва давача, для диму ще й місце
  time: string; // час події, «22:15:07»
}

interface AlertListProps {
  alerts: AlertItem[];
  status: StreamStatus;
  // Маршрут SSE, на який підписана сторінка, — показується в рядку стану.
  path: string;
  onClear: () => void;
}

const STATUS_TEXT: Record<StreamStatus, string> = {
  open: "підключено",
  connecting: "підключення…",
  off: "немає з'єднання",
};

const STATUS_DOT: Record<StreamStatus, string> = {
  open: "bg-green-600",
  connecting: "bg-amber-500",
  off: "bg-gray-400",
};

// Лаб. №6: блок сповіщень про критичні події, які сервер надсилає через SSE.
export default function AlertList({
  alerts,
  status,
  path,
  onClear,
}: AlertListProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <span
            className={`inline-block shrink-0 w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`}
          />
          <span>
            Сповіщення в реальному часі (SSE {path}):{" "}
            <strong>{STATUS_TEXT[status]}</strong>
            {alerts.length === 0 && status === "open"
              ? " · критичних подій поки немає"
              : ""}
          </span>
        </p>
        {alerts.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-blue-700 hover:underline"
          >
            Очистити
          </button>
        )}
      </div>

      {/* Блоки показуються лише тоді, коли сповіщення є. */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.key}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md"
              role="alert"
            >
              <p className="font-bold">⚠ {alert.message}</p>
              <p className="text-sm">
                Давач: {alert.source} | Час: {alert.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
