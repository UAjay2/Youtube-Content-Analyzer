function ErrorAlert({ error, onDismiss }) {
  return (
    <div className="alert" role="alert">
      <svg
        className="alert-icon"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 7v6M12 16.5v.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="alert-body">
        <p className="alert-message">{error.message}</p>
        {error.hint && <p className="alert-hint">{error.hint}</p>}
      </div>

      <button
        type="button"
        className="icon-btn"
        onClick={onDismiss}
        aria-label="Dismiss this message"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default ErrorAlert;
