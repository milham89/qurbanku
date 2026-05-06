import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, sub, color = 'primary', trend }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-top">
        <div className={`stat-icon stat-icon--${color}`}>
          <Icon size={22} />
        </div>
        {trend !== undefined && (
          <span className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
