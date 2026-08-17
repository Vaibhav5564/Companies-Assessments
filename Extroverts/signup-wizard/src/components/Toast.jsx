function Toast({ message, type = "error", onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;