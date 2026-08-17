import { useState } from "react";

function OTPStep({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const DEMO_OTP = "123456";

  const handleChange = (event) => {
    const value = event.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Maximum 6 digits
    if (value.length > 6) {
      return;
    }

    updateFormData({
      otp: value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    // Simulate API verification
    setTimeout(() => {
      if (formData.otp === DEMO_OTP) {
        setIsLoading(false);
        setError("");
        nextStep();
      } else {
        setIsLoading(false);
        setError("Invalid OTP. Please try again.");
      }
    }, 1200);
  };

  return (
    <section className="wizard-step">
      <div className="wizard-header">
        <span className="step-label">Step 2</span>

        <h1>Verify your email</h1>

        <p>
          Enter the 6-digit OTP sent to:
        </p>

        <strong>{formData.email}</strong>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">
            OTP
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            autoComplete="one-time-code"
          />

          {error && (
            <p className="field-error">
              {error}
            </p>
          )}
        </div>

        <div className="wizard-actions">
          <button
            type="button"
            onClick={previousStep}
            disabled={isLoading}
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </form>

      <p className="demo-otp">
        Demo OTP: <strong>123456</strong>
      </p>
    </section>
  );
}

export default OTPStep;