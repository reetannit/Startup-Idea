import { Link } from 'react-router-dom';

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getScoreColor(score) {
  if (score >= 70) return 'var(--success)';
  if (score >= 40) return 'var(--warning)';
  return 'var(--danger)';
}

export default function IdeaCard({ idea, index = 0 }) {
  const { _id, title, description, status, report, createdAt } = idea;

  return (
    <Link
      to={`/ideas/${_id}`}
      className={`idea-card fade-in-up stagger-${Math.min(index + 1, 6)}`}
      id={`idea-card-${_id}`}
      style={{ opacity: 0 }}
    >
      <div className="idea-card-header">
        <h3 className="idea-card-title">{title}</h3>
        <span className={`status-badge ${status}`}>
          {status === 'analyzing' ? 'Analyzing' : status === 'completed' ? 'Ready' : status === 'failed' ? 'Failed' : 'Pending'}
        </span>
      </div>

      <p className="idea-card-description">{description}</p>

      <div className="idea-card-footer">
        <span className="idea-card-meta">{getTimeAgo(createdAt)}</span>
        {report && status === 'completed' && (
          <div className="idea-card-scores">
            <span className={`risk-badge ${report.risk_level?.toLowerCase()}`}>
              {report.risk_level} Risk
            </span>
            <span className="score-mini" style={{ color: getScoreColor(report.profitability_score) }}>
              <span className="score-icon">📊</span>
              {report.profitability_score}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
