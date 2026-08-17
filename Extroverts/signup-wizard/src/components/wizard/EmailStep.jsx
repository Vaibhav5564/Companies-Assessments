import { useState } from "react";

function EmailStep({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) {
  const [otpMode, setOtpMode] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const DEMO_OTP = "123456";

  const handleEmailChange = (event) => {
    updateFormData({
      email: event.target.value,
    });

    setEmailError("");
  };

  const handleOTPChange = (event) => {
    const value = event.target.value;

    if (!/^\d*$/.test(value) || value.length > 6) {
      return;
    }

    updateFormData({
      otp: value,
    });

    setOtpError("");
  };

  const validateEmail = () => {
    const email = formData.email.trim();

    if (!email) {
      setEmailError("Email address is required.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSendOTP = (event) => {
    event.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setOtpMode(true);
    }, 1000);
  };

  const handleVerifyOTP = (event) => {
    event.preventDefault();

    if (formData.otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (formData.otp === DEMO_OTP) {
        setIsLoading(false);
        setOtpError("");
        nextStep();
      } else {
        setIsLoading(false);
        setOtpError("Invalid OTP. Please try again.");
      }
    }, 1000);
  };

  return (
    <section className="wizard-step">
      <div className="wizard-header">
        <span className="step-label">Step 1 of 4</span>

        {!otpMode ? (
          <>
            <h1>Let's get started</h1>

            <p>
              Enter your email address to continue.
            </p>
          </>
        ) : (
          <>
            <h1>Verify your email</h1>

            <p>
              Enter the 6-digit OTP sent to:
            </p>

            <strong>{formData.email}</strong>
          </>
        )}
      </div>

      {!otpMode ? (
        <form onSubmit={handleSendOTP}>
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
              onBlur={validateEmail}
              placeholder="Enter your email"
              autoComplete="email"
            />

            {emailError && (
              <p className="field-error">
                {emailError}
              </p>
            )}
          </div>

          <div className="wizard-actions">
            <button
              type="button"
              onClick={previousStep}
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <div className="form-group">
            <label htmlFor="otp">
              OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={formData.otp}
              onChange={handleOTPChange}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
            />

            {otpError && (
              <p className="field-error">
                {otpError}
              </p>
            )}
          </div>

          <div className="wizard-actions">
            <button
              type="button"
              onClick={() => {
                setOtpMode(false);
                updateFormData({ otp: "" });
              }}
              disabled={isLoading}
            >
              Change Email
            </button>

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </div>

          <p className="demo-otp">
            Demo OTP: <strong>123456</strong>
          </p>
        </form>
      )}
    </section>
  );
}

export default EmailStep;