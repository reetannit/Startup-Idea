import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">🚀</div>
          <div className="navbar-title">
            <span>IdeaValidator</span>
          </div>
        </Link>
        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-dashboard"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/submit"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-submit"
          >
            Submit
          </NavLink>
          <Link to="/submit" className="nav-cta" id="nav-cta-new">
            + New Idea
          </Link>
        </div>
      </div>
    </nav>
  );
}
