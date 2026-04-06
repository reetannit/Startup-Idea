const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Submit a new startup idea for AI analysis
 */
export const submitIdea = async (title, description) => {
  const res = await fetch(`${API_URL}/ideas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to submit idea');
  }
  return res.json();
};

/**
 * Fetch all ideas with optional pagination
 */
export const getIdeas = async (page = 1, limit = 20) => {
  const res = await fetch(`${API_URL}/ideas?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch ideas');
  return res.json();
};

/**
 * Fetch a single idea by ID
 */
export const getIdeaById = async (id) => {
  const res = await fetch(`${API_URL}/ideas/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Idea not found');
    throw new Error('Failed to fetch idea');
  }
  return res.json();
};

/**
 * Delete an idea by ID
 */
export const deleteIdea = async (id) => {
  const res = await fetch(`${API_URL}/ideas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete idea');
  return res.json();
};
