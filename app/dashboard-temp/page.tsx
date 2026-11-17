"use client";

import AlertList from "@/components/AlertList";
import DataState from "@/components/DataState";
import SensorChart from "@/components/SensorChart";
import StatCard from "@/components/StatCard";
import {
  API_URL,
  timeLabel,
  type TemperatureAlert,
  type TemperatureRecord,
} from "@/lib/api";
import { axisTicks } from "@/lib/chart";
import { useAlerts } from "@/lib/useAlerts";
import { useSensorData } from "@/lib/useSensorData";

// Маршрут серверного API для давача температури.
const PATH = "/temperature-sensors";
// Лаб. №6: SSE-маршрут, яким сервер надсилає сповіщення про критичну температуру.
const ALERTS_PATH = "/temperature-sensors/alerts";
// Як часто перечитувати дані із сервера, мс.
const REFRESH_MS = 5000;
// Скільки останніх показань показувати на графіку.
const WINDOW_SIZE = 20;

export default function DashboardTemp() {
  const { records, status, error, updatedAt, send } =
    useSensorData<TemperatureRecord>(PATH, REFRESH_MS);
  // Лаб. №6: останні 5 сповіщень. Критичне значення (-10 °C) клієнт не знає
  // і сам нічого не перевіряє — вирішує сервер.
  const {
    alerts,
    status: streamStatus,
    clear,
  } = useAlerts<TemperatureAlert>(ALERTS_PATH);

  // Записи сервера → точки графіка: час із timestamp, значення з value.
  const readings = records.slice(-WINDOW_SIZE).map((record) => ({
    time: timeLabel(record.timestamp),
    value: record.value,
  }));

  const values = readings.map((reading) => reading.value);
  const hasData = values.length > 0;
  const last = records[records.length - 1];
  const unit = !last || last.unit === "C" ? "°C" : last.unit;

  // Вісь Y рахується з даних (у лаб. №2 межі були сталі, бо числа генерував сам клієнт).
  // Запас в 1 градус з кожного боку, щоб лінія не прилипала до країв графіка.
  const ticks = hasData
    ? axisTicks(Math.min(...values) - 1, Math.max(...values) + 1)
    : [0, 1];

  // Те саме тіло запиту, що в POST із Postman.
  const addReading = (value: number) =>
    send({ sensorName: "Temp", value: Math.round(value * 10) / 10, unit: "C" });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Графік температурного сенсора 🌡️
      </h1>

      <AlertList
        alerts={alerts.map((alert) => ({
          key: alert.key,
          message: alert.message,
          source: alert.sensorName,
          time: timeLabel(alert.timestamp),
        }))}
        status={streamStatus}
        path={ALERTS_PATH}
        onClear={clear}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Поточне значення"
          value={hasData ? `${values[values.length - 1]} ${unit}` : "—"}
        />
        <StatCard
          label="Мінімум"
          value={hasData ? `${Math.min(...values)} ${unit}` : "—"}
        />
        <StatCard
          label="Максимум"
          value={hasData ? `${Math.max(...values)} ${unit}` : "—"}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-medium">
            {last ? last.sensorName : "Давач"} · температура, {unit}
          </h2>
          <div className="flex flex-wrap gap-2">
            {/* Звичайне показання: 20–25 °C, сповіщення не викликає. */}
            <button
              type="button"
              onClick={() => addReading(20 + Math.random() * 5)}
              disabled={status !== "ready"}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Додати показання
            </button>
            {/* Лаб. №6: показання від -11 до -20 °C — нижче за критичне. */}
            <button
              type="button"
              onClick={() => addReading(-11 - Math.random() * 9)}
              disabled={status !== "ready"}
              className="px-4 py-2 bg-white text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Імітувати мороз
            </button>
          </div>
        </div>

        <DataState status={status} error={error} empty={!hasData} path={PATH}>
          <SensorChart data={readings} unit={unit} ticks={ticks} />
        </DataState>

        <p className="mt-4 text-sm text-gray-600 break-all">
          Джерело: {API_URL}
          {PATH} · отримано записів із бази: {records.length} (сервер віддає
          останні 50) · оновлено: {updatedAt || "—"}
        </p>
      </div>
    </div>
  );
}
