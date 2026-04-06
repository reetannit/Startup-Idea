import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getIdeaById, deleteIdea } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import ReportSection from '../components/ReportSection';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function IdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchIdea = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIdeaById(id);
      setIdea(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea();

    // Poll while analyzing
    const interval = setInterval(async () => {
      try {
        const data = await getIdeaById(id);
        setIdea(data);
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
        }
      } catch {
        // silent
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteIdea(id);
      toast.success('Idea deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <Link to="/" className="detail-back">← Back to Dashboard</Link>
        <div className="error-container">
          <h2>⚠️ {error}</h2>
          <p>The idea you're looking for might have been deleted or doesn't exist.</p>
          <button className="btn-retry" onClick={fetchIdea}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  const { title, description, status, report, createdAt } = idea;
  const isAnalyzing = status === 'analyzing' || status === 'pending';
  const isFailed = status === 'failed';

  return (
    <div className="detail-page" id="idea-detail">
      <Link to="/" className="detail-back">← Back to Dashboard</Link>

      {/* Hero Card */}
      <div className="detail-hero">
        <div className="detail-hero-top">
          <div>
            <h1>{title}</h1>
          </div>
          <div className="detail-actions">
            <button
              className="btn-delete"
              onClick={() => setShowDeleteModal(true)}
              id="delete-idea-btn"
            >
              🗑 Delete
            </button>
          </div>
        </div>
        <p className="detail-hero-description">{description}</p>
        <div className="detail-hero-meta">
          <span className={`status-badge ${status}`}>
            {status === 'analyzing' ? 'AI Analyzing...' : status === 'completed' ? 'Analysis Complete' : status === 'failed' ? 'Analysis Failed' : 'Pending'}
          </span>
          <span className="detail-meta-item">📅 {formatDate(createdAt)}</span>
        </div>
      </div>

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="loading-container" style={{ minHeight: '300px' }}>
          <div className="loading-spinner" />
          <p className="loading-text">🤖 AI is analyzing your startup idea...</p>
          <p className="loading-subtext">This usually takes 10-30 seconds. The page will update automatically.</p>
        </div>
      )}

      {/* Failed State */}
      {isFailed && (
        <div className="error-container" style={{ minHeight: '200px' }}>
          <h2>❌ Analysis Failed</h2>
          <p>The AI analysis couldn't be completed. This might be due to an API issue. Please try deleting and resubmitting.</p>
        </div>
      )}

      {/* Report */}
      {report && status === 'completed' && (
        <>
          {/* Overview Cards */}
          <div className="overview-cards fade-in-up" style={{ opacity: 0, animationDelay: '100ms' }}>
            <div className="overview-card">
              <span className="overview-card-label">Profitability</span>
              <ScoreGauge score={report.profitability_score} size={120} />
            </div>
            <div className="overview-card">
              <span className="overview-card-label">Risk Level</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
                <span style={{
                  fontSize: '2.5rem',
                  lineHeight: 1
                }}>
                  {report.risk_level === 'Low' ? '🟢' : report.risk_level === 'Medium' ? '🟡' : '🔴'}
                </span>
                <span className={`risk-badge ${report.risk_level?.toLowerCase()}`} style={{ fontSize: '0.9375rem', padding: '6px 18px' }}>
                  {report.risk_level}
                </span>
              </div>
            </div>
            <div className="overview-card">
              <span className="overview-card-label">Tech Stack</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-accent)' }}>
                  {report.tech_stack?.length || 0}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Technologies</span>
              </div>
            </div>
          </div>

          {/* Report Grid */}
          <div className="report-grid">
            <ReportSection icon="🎯" iconClass="problem" title="Problem Statement" delay={150}>
              <p>{report.problem}</p>
            </ReportSection>

            <ReportSection icon="👤" iconClass="customer" title="Customer Persona" delay={200}>
              <p>{report.customer}</p>
            </ReportSection>

            <ReportSection icon="📊" iconClass="market" title="Market Overview" fullWidth delay={250}>
              <p>{report.market}</p>
            </ReportSection>

            <ReportSection icon="⚔️" iconClass="competitor" title="Competitor Analysis" fullWidth delay={300}>
              <div className="competitor-list">
                {report.competitor?.map((comp, i) => (
                  <div key={i} className="competitor-item">
                    <div className="competitor-name">{comp.name}</div>
                    <div className="competitor-diff">{comp.differentiation}</div>
                  </div>
                ))}
              </div>
            </ReportSection>

            <ReportSection icon="🛠️" iconClass="tech" title="Recommended Tech Stack" delay={350}>
              <div className="tech-stack-list">
                {report.tech_stack?.map((tech, i) => (
                  <span key={i} className="tech-pill">{tech}</span>
                ))}
              </div>
            </ReportSection>

            <ReportSection icon="💡" iconClass="justification" title="Justification & Assessment" delay={400}>
              <p>{report.justification}</p>
            </ReportSection>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this idea?</h3>
            <p>This action cannot be undone. The idea and its analysis report will be permanently deleted.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button
                className="btn-confirm-delete"
                onClick={handleDelete}
                disabled={deleting}
                id="confirm-delete-btn"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
