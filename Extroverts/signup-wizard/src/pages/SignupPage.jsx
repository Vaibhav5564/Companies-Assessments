import { useNavigate } from "react-router-dom";
import { useState } from "react";

import EmailStep from "../components/wizard/EmailStep";
import OTPStep from "../components/wizard/OTPStep";
import PersonalDetailsStep from "../components/wizard/PersonalDetailsStep";
import EducationStep from "../components/wizard/EducationStep";
import FinalDetailsStep from "../components/wizard/FinalDetailsStep";

function SignupPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    name: "",
    age: "",
    pronouns: "",
    state: "",
    city: "",
    college: "",
    phone: "",
    gender: "",
  });

  const updateFormData = (data) => {
    setFormData((previousData) => ({
      ...previousData,
      ...data,
    }));
  };

  const nextStep = () => {
    setCurrentStep((previousStep) => previousStep + 1);
  };

  const previousStep = () => {
    setCurrentStep((previousStep) => previousStep - 1);
  };

  const handleComplete = () => {
    console.log("Signup completed:", formData);
    navigate("/success");
  };

  const handleBackToTerms = () => {
    navigate("/terms");
  };

  return (
    <main className="signup-page">
      <div className="signup-container">

        {currentStep === 1 && (
          <EmailStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            previousStep={handleBackToTerms}
          />
        )}

        {currentStep === 2 && (
          <PersonalDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            previousStep={previousStep}
          />
        )}

        {currentStep === 3 && (
          <EducationStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            previousStep={previousStep}
          />
        )}

        {currentStep === 4 && (
          <FinalDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            handleComplete={handleComplete}
            previousStep={previousStep}
          />
        )}

      </div>
    </main>
  );
}

export default SignupPage;