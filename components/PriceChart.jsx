"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PriceChart({ priceHistory, currency }) {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        No price history available yet.
      </p>
    );
  }

  const chartData = priceHistory
    .slice()
    .reverse()
    .map((entry) => ({
      date: new Date(entry.checked_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: entry.price,
    }));

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            tickFormatter={(value) => `${currency || "$"}${value}`}
          />
          <Tooltip
            formatter={(value) => [
              `${currency || "$"}${value}`,
              "Price",
            ]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
