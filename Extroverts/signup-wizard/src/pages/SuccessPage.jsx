import { useNavigate } from "react-router-dom";

function SuccessPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <main className="success-page">
      <div className="success-container">
        <div className="success-icon">
          ✓
        </div>

        <h1>Signup Successful!</h1>

        <p>
          Your profile has been created successfully.
        </p>

        <button onClick={handleGoHome}>
          Back to Home
        </button>
      </div>
    </main>
  );
}

export default SuccessPage;