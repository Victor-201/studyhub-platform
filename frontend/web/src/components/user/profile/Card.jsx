export default function Card({ title, children, actions }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
