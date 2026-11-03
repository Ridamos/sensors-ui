interface StatCardProps {
  label: string;
  value: string;
  // alarm — картка підсвічується червоним (значення перевищило поріг).
  tone?: "normal" | "alarm";
}

// Невелика картка з одним показником: підпис зверху, значення знизу.
export default function StatCard({
  label,
  value,
  tone = "normal",
}: StatCardProps) {
  const alarm = tone === "alarm";

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        alarm ? "bg-red-50 border-red-300" : "bg-white border-gray-200"
      }`}
    >
      <p className="text-sm text-gray-600">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold ${
          alarm ? "text-red-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
