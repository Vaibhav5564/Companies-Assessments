import { useState } from "react";

function FinalDetailsStep({
  formData,
  updateFormData,
  handleComplete,
  previousStep,
}) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    updateFormData({
      [name]: value,
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      handleComplete();
    }, 1500);
  };

  return (
    <section className="wizard-step">
      <div className="wizard-header">
        <span className="step-label">Step 5</span>

        <h1>Almost there!</h1>

        <p>
          Add the final details to complete your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={formData.phone || ""}
            onChange={(event) => {
              const value = event.target.value;

              if (/^\d*$/.test(value) && value.length <= 10) {
                handleChange({
                  target: {
                    name: "phone",
                    value,
                  },
                });
              }
            }}
            placeholder="Enter 10-digit phone number"
            maxLength={10}
          />

          {errors.phone && (
            <p className="field-error">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>

          <select
            id="gender"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">
              Prefer not to say
            </option>
          </select>

          {errors.gender && (
            <p className="field-error">
              {errors.gender}
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
            {isLoading ? "Creating Profile..." : "Complete Signup"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FinalDetailsStep;