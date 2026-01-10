export default function StatCard({ title, value, icon: Icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl shadow hover:shadow-lg transition 
                  bg-${color}-100 flex items-center space-x-4`}
    >
      <Icon className={`w-8 h-8 text-${color}-600`} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
