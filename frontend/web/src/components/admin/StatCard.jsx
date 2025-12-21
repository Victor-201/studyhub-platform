// src/components/admin/StatCard.jsx
const colors = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
};

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>

      <div className={`p-3 rounded-full ${colors[color]}`}>
        <Icon size={22} />
      </div>
    </div>
  );
}
