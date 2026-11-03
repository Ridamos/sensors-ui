// Базова адреса серверного застосунку (NestJS на Render або локально).
// Значення береться з .env (локально) або з Environment Variables у Vercel.
// Префікс NEXT_PUBLIC_ потрібен, щоб змінна потрапила в код, який виконується в браузері.
// Косу риску в кінці прибираємо, щоб не вийшло «…onrender.com//temperature-sensors».
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/+$/,
  "",
);

// Одна точка графіка.
export interface Reading {
  time: string; // час зчитування, «22:15:07»
  value: number;
  alarm?: boolean; // для давача диму: сервер позначив показання як тривожне
}

// Запис температурного давача — у такому вигляді його повертає сервер.
export interface TemperatureRecord {
  id: string;
  timestamp: string;
  sensorName: string;
  value: number;
  unit: string;
}

// Запис давача диму. threshold і alarm обчислює сервер (лаб. №1).
export interface SmokeRecord {
  id: string;
  timestamp: string;
  sensorName: string;
  location: string;
  value: number;
  unit: string;
  threshold: number;
  alarm: boolean;
}

// Час із серверного timestamp у вигляді «гг:хх:сс».
export function timeLabel(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
