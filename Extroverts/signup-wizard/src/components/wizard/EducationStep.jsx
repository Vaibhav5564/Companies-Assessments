import { useState } from "react";
import { states, cities, colleges } from "../../data/locations";

function EducationStep({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) {
  const [errors, setErrors] = useState({});

  const availableCities = formData.state
    ? cities[formData.state] || []
    : [];

  const availableColleges = formData.city
    ? colleges[formData.city] || []
    : [];

  const handleStateChange = (event) => {
    const state = event.target.value;

    updateFormData({
      state,
      city: "",
      college: "",
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      state: "",
      city: "",
      college: "",
    }));
  };

  const handleCityChange = (event) => {
    const city = event.target.value;

    updateFormData({
      city,
      college: "",
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      city: "",
      college: "",
    }));
  };

  const handleCollegeChange = (event) => {
    updateFormData({
      college: event.target.value,
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      college: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.state) {
      newErrors.state = "Please select your state.";
    }

    if (!formData.city) {
      newErrors.city = "Please select your city.";
    }

    if (!formData.college) {
      newErrors.college = "Please select your college.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <section className="wizard-step">
      <div className="wizard-header">
        <span className="step-label">Step 4</span>

        <h1>Education details</h1>

        <p>
          Tell us where you are studying.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="state">State</label>

          <select
            id="state"
            value={formData.state}
            onChange={handleStateChange}
          >
            <option value="">Select state</option>

            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {errors.state && (
            <p className="field-error">{errors.state}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>

          <select
            id="city"
            value={formData.city}
            onChange={handleCityChange}
            disabled={!formData.state}
          >
            <option value="">
              {formData.state
                ? "Select city"
                : "Select state first"}
            </option>

            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {errors.city && (
            <p className="field-error">{errors.city}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="college">College</label>

          <select
            id="college"
            value={formData.college}
            onChange={handleCollegeChange}
            disabled={!formData.city}
          >
            <option value="">
              {formData.city
                ? "Select college"
                : "Select city first"}
            </option>

            {availableColleges.map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>

          {errors.college && (
            <p className="field-error">{errors.college}</p>
          )}
        </div>

        <div className="wizard-actions">
          <button
            type="button"
            onClick={previousStep}
          >
            Back
          </button>

          <button type="submit">
            Continue
          </button>
        </div>
      </form>
    </section>
  );
}

export default EducationStep;