"use client";

import DataState from "@/components/DataState";
import SensorChart from "@/components/SensorChart";
import StatCard from "@/components/StatCard";
import { API_URL, timeLabel, type SmokeRecord } from "@/lib/api";
import { axisTicks } from "@/lib/chart";
import { useSensorData } from "@/lib/useSensorData";

// Маршрут серверного API для давача диму.
const PATH = "/smoke-sensors";
// Як часто перечитувати дані із сервера, мс.
const REFRESH_MS = 5000;
// Скільки останніх показань показувати на графіку.
const WINDOW_SIZE = 20;
// Графік будується в ppm. Показання в %/m (сервер їх теж приймає) мають
// іншу шкалу, тому на цей графік не потрапляють.
const UNIT = "ppm";

export default function DashboardSmoke() {
  const { records, status, error, updatedAt, send } =
    useSensorData<SmokeRecord>(PATH, REFRESH_MS);

  const shown = records
    .filter((record) => record.unit === UNIT)
    .slice(-WINDOW_SIZE);

  // Тривогу (alarm) і поріг (threshold) клієнт не рахує — бере готові із сервера,
  // де діє правило з лаб. №1: alarm = value >= threshold.
  const readings = shown.map((record) => ({
    time: timeLabel(record.timestamp),
    value: record.value,
    alarm: record.alarm,
  }));

  const values = readings.map((reading) => reading.value);
  const hasData = values.length > 0;
  const last = shown[shown.length - 1];
  const alarm = hasData && last.alarm;
  const alarmCount = shown.filter((record) => record.alarm).length;
  const threshold = last?.threshold;

  // Вісь Y від 0 до найбільшого значення або порога, але щонайменше до 500 ppm.
  const ticks = axisTicks(0, Math.max(500, ...values, threshold ?? 0));

  // Тіло запиту — як у POST із Postman. Поріг не передаємо: сервер підставить 300 ppm.
  const addReading = (value: number) =>
    send({ sensorName: "MQ-2 #1", location: "Серверна", value, unit: UNIT });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Графік давача диму 💨</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Поточне значення"
          value={hasData ? `${last.value} ${UNIT}` : "—"}
          tone={alarm ? "alarm" : "normal"}
        />
        <StatCard
          label="Стан"
          value={!hasData ? "—" : alarm ? "⚠ Тривога" : "✓ Норма"}
          tone={alarm ? "alarm" : "normal"}
        />
        <StatCard
          label={`Перевищень порога (з ${values.length})`}
          value={hasData ? String(alarmCount) : "—"}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-medium">
            {last ? `${last.sensorName}, ${last.location}` : "Давач"} · дим,{" "}
            {UNIT}
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addReading(Math.round(120 + Math.random() * 130))}
              disabled={status !== "ready"}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Додати показання
            </button>
            <button
              type="button"
              onClick={() => addReading(Math.round(350 + Math.random() * 70))}
              disabled={status !== "ready"}
              className="px-4 py-2 bg-white text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Імітувати задимлення
            </button>
          </div>
        </div>

        <DataState status={status} error={error} empty={!hasData} path={PATH}>
          <SensorChart
            data={readings}
            unit={UNIT}
            ticks={ticks}
            threshold={threshold}
          />
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
