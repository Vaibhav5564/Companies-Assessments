import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/terms");
  };

  return (
    <main className="landing-page">
      <div className="landing-container">
        <div className="landing-content">
          <h1>Welcome</h1>

          <p>
            Create your profile and get started with Nubpack.
          </p>

          <button onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;