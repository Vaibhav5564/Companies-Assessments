export const validateEmail = (email) => {
  const value = email.trim();

  if (!value) {
    return "Email address is required.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
};

export const validateAge = (age) => {
  if (!age) {
    return "Age is required.";
  }

  if (Number(age) < 18) {
    return "You must be at least 18 years old.";
  }

  if (Number(age) > 100) {
    return "Please enter a valid age.";
  }

  return "";
};

export const validatePhone = (phone) => {
  if (!phone) {
    return "Phone number is required.";
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    return "Enter a valid 10-digit phone number.";
  }

  return "";
};

export const validateOTP = (otp) => {
  if (!otp) {
    return "OTP is required.";
  }

  if (!/^[0-9]{6}$/.test(otp)) {
    return "Please enter a valid 6-digit OTP.";
  }

  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return `${fieldName} is required.`;
  }

  return "";
};