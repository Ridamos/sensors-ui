"use client";

import DataState from "@/components/DataState";
import SensorChart from "@/components/SensorChart";
import StatCard from "@/components/StatCard";
import { API_URL, timeLabel, type TemperatureRecord } from "@/lib/api";
import { axisTicks } from "@/lib/chart";
import { useSensorData } from "@/lib/useSensorData";

// Маршрут серверного API для давача температури.
const PATH = "/temperature-sensors";
// Як часто перечитувати дані із сервера, мс.
const REFRESH_MS = 5000;
// Скільки останніх показань показувати на графіку.
const WINDOW_SIZE = 20;

export default function DashboardTemp() {
  const { records, status, error, updatedAt, send } =
    useSensorData<TemperatureRecord>(PATH, REFRESH_MS);

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

  // Те саме тіло запиту, що в POST із Postman: випадкова температура 20–25 °C.
  const addReading = () =>
    send({
      sensorName: "Temp",
      value: Math.round((20 + Math.random() * 5) * 10) / 10,
      unit: "C",
    });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Графік температурного сенсора 🌡️
      </h1>

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
          <button
            type="button"
            onClick={addReading}
            disabled={status !== "ready"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Додати показання
          </button>
        </div>

        <DataState status={status} error={error} empty={!hasData} path={PATH}>
          <SensorChart data={readings} unit={unit} ticks={ticks} />
        </DataState>

        <p className="mt-4 text-sm text-gray-600 break-all">
          Джерело: {API_URL}
          {PATH} · записів на сервері: {records.length} · оновлено:{" "}
          {updatedAt || "—"}
        </p>
      </div>
    </div>
  );
}
