import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cards.css';

const EmptyState = ({
  icon = '📦',
  title = 'No Items Found',
  description = 'There are no records available matching your criteria.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLink ? (
        <Link to={actionLink} className="btn-primary">
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button className="btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
