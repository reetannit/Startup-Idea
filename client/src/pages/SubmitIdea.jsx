import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitIdea } from '../services/api';

const TITLE_MAX = 200;
const DESC_MAX = 5000;

export default function SubmitIdea() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (description.trim().length < 20) {
      toast.error('Description should be at least 20 characters');
      return;
    }

    setLoading(true);
    try {
      const idea = await submitIdea(title.trim(), description.trim());
      toast.success('Idea submitted! AI analysis in progress...');
      navigate(`/ideas/${idea._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to submit idea');
    } finally {
      setLoading(false);
    }
  };

  const getCharCountClass = (current, max) => {
    const pct = current / max;
    if (pct >= 1) return 'at-limit';
    if (pct >= 0.85) return 'near-limit';
    return '';
  };

  return (
    <div className="submit-page">
      <div className="page-header">
        <h1>Submit Your Startup Idea</h1>
        <p>Describe your startup concept and our AI will generate a comprehensive validation report</p>
      </div>

      <form className="submit-form" onSubmit={handleSubmit} id="submit-idea-form">
        <div className="form-group">
          <label className="form-label" htmlFor="idea-title">
            Idea Title
            <span className={`char-count ${getCharCountClass(title.length, TITLE_MAX)}`}>
              {title.length}/{TITLE_MAX}
            </span>
          </label>
          <input
            id="idea-title"
            type="text"
            className="form-input"
            placeholder="e.g., AI-Powered Personal Finance Coach"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
            disabled={loading}
            autoFocus
          />
          <p className="form-hint">A concise name for your startup concept</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="idea-description">
            Description
            <span className={`char-count ${getCharCountClass(description.length, DESC_MAX)}`}>
              {description.length}/{DESC_MAX}
            </span>
          </label>
          <textarea
            id="idea-description"
            className="form-input"
            placeholder="Describe the problem you're solving, your target audience, the proposed solution, and your unique value proposition..."
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
            disabled={loading}
            rows={8}
          />
          <p className="form-hint">Include the problem, target market, proposed solution, and unique value proposition</p>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading || !title.trim() || !description.trim()}
          id="submit-idea-btn"
        >
          {loading ? (
            <>
              <div className="btn-spinner" />
              Analyzing with AI...
            </>
          ) : (
            <>
              🚀 Validate My Idea
            </>
          )}
        </button>
      </form>
    </div>
  );
}
