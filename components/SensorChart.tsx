"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Reading } from "@/lib/api";

const LINE_COLOR = "#2563eb"; // blue-600
const ALARM_COLOR = "#dc2626"; // red-600

interface SensorChartProps {
  data: Reading[];
  unit: string;
  // Поділки осі Y; перша й остання задають її межі.
  ticks: number[];
  // Якщо задано — малюється лінія порога тривоги.
  threshold?: number;
}

// Лінійний графік показників давача. Використовується на обох сторінках.
export default function SensorChart({
  data,
  unit,
  ticks,
  threshold,
}: SensorChartProps) {
  return (
    <div>
      {threshold !== undefined && (
        // Пояснення до графіка: що означає пунктир і червоні точки.
        <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2 text-sm text-gray-700">
          <span className="flex items-center gap-2">
            <span className="inline-block w-6 border-t-2 border-dashed border-red-600" />
            поріг тривоги {threshold} {unit}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600" />
            показання на порозі або вище
          </span>
        </div>
      )}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              minTickGap={24}
            />
            <YAxis
              domain={[ticks[0], ticks[ticks.length - 1]]}
              ticks={ticks}
              width={44}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Tooltip
              formatter={(value) => [`${value} ${unit}`, "Значення"]}
              labelFormatter={(label) => `Час: ${label}`}
            />
            {threshold !== undefined && (
              <ReferenceLine
                y={threshold}
                stroke={ALARM_COLOR}
                strokeDasharray="6 4"
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={LINE_COLOR}
              strokeWidth={2}
              isAnimationActive={false}
              activeDot={{ r: 6 }}
              dot={({ cx, cy, index, payload }) => (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r={4}
                  stroke="#ffffff"
                  strokeWidth={2}
                  // Червона точка — показання, яке сервер позначив як тривожне.
                  fill={(payload as Reading).alarm ? ALARM_COLOR : LINE_COLOR}
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
