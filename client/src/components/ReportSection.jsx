export default function ReportSection({ icon, iconClass, title, children, fullWidth = false, className = '', delay = 0 }) {
  return (
    <div
      className={`report-section fade-in-up ${fullWidth ? 'full-width' : ''} ${className}`}
      style={{ opacity: 0, animationDelay: `${delay}ms` }}
    >
      <div className="report-section-header">
        <div className={`report-section-icon ${iconClass}`}>
          {icon}
        </div>
        <h3 className="report-section-title">{title}</h3>
      </div>
      <div className="report-section-content">
        {children}
      </div>
    </div>
  );
}
