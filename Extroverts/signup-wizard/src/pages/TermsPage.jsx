import { useNavigate } from "react-router-dom";

function TermsPage() {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate("/signup");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <main className="terms-page">
      <div className="terms-container">
        <button onClick={handleBack}>
          ← Back
        </button>

        <h1>Terms & Conditions</h1>

        <div className="terms-content">
          <p>
            Please read and accept the terms and conditions before
            continuing with your signup.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By continuing, you agree to follow the terms and conditions
            applicable to the application.
          </p>

          <h2>2. User Information</h2>
          <p>
            You agree to provide accurate and complete information while
            creating your profile.
          </p>

          <h2>3. Privacy</h2>
          <p>
            Your information should be handled according to the applicable
            privacy policies.
          </p>
        </div>

        <button onClick={handleAccept}>
          I Accept & Continue
        </button>
      </div>
    </main>
  );
}

export default TermsPage;