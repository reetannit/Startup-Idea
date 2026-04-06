import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard';
import { getIdeas } from '../services/api';

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIdeas();
      setIdeas(data.ideas || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();

    // Poll for updates every 10 seconds (for analyzing ideas)
    const interval = setInterval(async () => {
      try {
        const data = await getIdeas();
        setIdeas(data.ideas || []);
      } catch {
        // silent fail on polling
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const completedIdeas = ideas.filter(i => i.status === 'completed');
  const analyzingIdeas = ideas.filter(i => i.status === 'analyzing');
  const avgScore = completedIdeas.length
    ? Math.round(completedIdeas.reduce((sum, i) => sum + (i.report?.profitability_score || 0), 0) / completedIdeas.length)
    : 0;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading your ideas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <h2>⚠️ Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchIdeas}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page" id="dashboard">
      <div className="dashboard-header">
        <h1>Your Ideas</h1>
        <div className="dashboard-stats">
          <div className="stat-pill">
            <span className="stat-value">{ideas.length}</span> Total
          </div>
          {analyzingIdeas.length > 0 && (
            <div className="stat-pill">
              <span className="stat-value">{analyzingIdeas.length}</span> Analyzing
            </div>
          )}
          {completedIdeas.length > 0 && (
            <div className="stat-pill">
              <span className="stat-value">{avgScore}</span> Avg Score
            </div>
          )}
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="empty-state" id="empty-state">
          <div className="empty-state-icon">💡</div>
          <h2>No ideas yet</h2>
          <p>Submit your first startup idea and get an instant AI-powered validation report</p>
          <Link to="/submit" className="empty-state-cta">
            Submit Your First Idea
          </Link>
        </div>
      ) : (
        <div className="ideas-grid" id="ideas-grid">
          {ideas.map((idea, i) => (
            <IdeaCard key={idea._id} idea={idea} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
