export const BUDGET_OPTIONS = ['< $1K', '$1K - $5K', '$5K - $10K', '$10K - $25K', '$25K+'];

export const validateName = (name) => {
  if (!name || name.trim().length < 2 || name.trim().length > 100) {
    return 'Name must be between 2 and 100 characters';
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validateBudget = (budget) => {
  if (!budget || !BUDGET_OPTIONS.includes(budget)) {
    return 'Please select a valid budget';
  }
  return null;
};

export const validateMessage = (message) => {
  if (!message || message.trim().length < 10 || message.trim().length > 2000) {
    return 'Message must be between 10 and 2000 characters';
  }
  return null;
};

export const validateLeadForm = (data) => {
  const errors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const budgetError = validateBudget(data.budget);
  if (budgetError) errors.budget = budgetError;
  
  const messageError = validateMessage(data.message);
  if (messageError) errors.message = messageError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
