import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Mini Tracker',
  showBack = false,
  actions,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <header className="sticky top-0 z-40 bg-tg-bg border-b border-tg-secondary-bg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="text-tg-button hover:opacity-80 transition-opacity"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-tg-text">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      <nav className="flex border-t border-tg-secondary-bg">
        <NavItem to="/" label="Tasks" icon="tasks" active={location.pathname === '/'} />
        <NavItem to="/board" label="Board" icon="board" active={location.pathname === '/board'} />
        <NavItem to="/calendar" label="Calendar" icon="calendar" active={location.pathname === '/calendar'} />
      </nav>
    </header>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  icon: 'tasks' | 'board' | 'calendar';
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, active }) => {
  const navigate = useNavigate();
  
  const icons = {
    tasks: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    board: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    calendar: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };
  
  return (
    <button
      onClick={() => navigate(to)}
      className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
        active
          ? 'text-tg-button border-b-2 border-tg-button'
          : 'text-tg-hint hover:text-tg-text'
      }`}
    >
      {icons[icon]}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};
