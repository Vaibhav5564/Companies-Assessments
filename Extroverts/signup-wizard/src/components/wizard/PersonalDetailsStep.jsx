import { useState } from "react";

function PersonalDetailsStep({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) {
  const [errors, setErrors] = useState({});

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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.age) {
      newErrors.age = "Age is required.";
    } else if (Number(formData.age) < 18) {
      newErrors.age = "You must be at least 18 years old.";
    } else if (Number(formData.age) > 100) {
      newErrors.age = "Please enter a valid age.";
    }

    if (!formData.pronouns) {
      newErrors.pronouns = "Please select your pronouns.";
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
        <span className="step-label">Step 3</span>

        <h1>Tell us about yourself</h1>

        <p>
          Add some basic information to complete your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            maxLength={50}
            autoComplete="name"
          />

          {errors.name && (
            <p className="field-error">{errors.name}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>

          <input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            min="18"
            max="100"
          />

          {errors.age && (
            <p className="field-error">{errors.age}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="pronouns">Pronouns</label>

          <select
            id="pronouns"
            name="pronouns"
            value={formData.pronouns}
            onChange={handleChange}
          >
            <option value="">Select pronouns</option>
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
            <option value="prefer-not-to-say">
              Prefer not to say
            </option>
          </select>

          {errors.pronouns && (
            <p className="field-error">{errors.pronouns}</p>
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

export default PersonalDetailsStep;