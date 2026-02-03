export const validateEmail = (email: string): string | null => {
  if (!email) return 'auth.validation.required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'auth.validation.invalidEmail';
  }
  
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'auth.validation.required';
  
  const phoneRegex = /^[\+]?[0-9]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'auth.validation.invalidPhone';
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'auth.validation.required';
  
  if (password.length < 6) {
    return 'auth.validation.passwordLength';
  }
  
  // Дополнительные проверки для сложности пароля
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return 'auth.validation.weakPassword';
  }
  
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) return 'auth.validation.required';
  
  if (password !== confirmPassword) {
    return 'auth.validation.passwordMismatch';
  }
  
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return 'auth.validation.required';
  
  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }
  
  return null;
};