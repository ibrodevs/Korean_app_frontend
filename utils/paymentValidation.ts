export const validateCardNumber = (cardNumber: string): string | null => {
  if (!cardNumber) return 'validation.cardNumberRequired';
  
  // Удаляем пробелы
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  // Проверяем длину (13-19 цифр)
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return 'validation.cardNumberInvalid';
  }
  
  // Алгоритм Луна для проверки валидности номера карты
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return 'validation.cardNumberInvalid';
  }
  
  return null;
};

export const validateExpiry = (expiry: string): string | null => {
  if (!expiry) return 'validation.expiryRequired';
  
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!regex.test(expiry)) {
    return 'validation.expiryInvalid';
  }
  
  const [month, year] = expiry.split('/').map(Number);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  // Проверяем, что срок действия не истек
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'validation.expiryInvalid';
  }
  
  return null;
};

export const validateCVV = (cvv: string, isAmex: boolean = false): string | null => {
  if (!cvv) return 'validation.cvvRequired';
  
  const length = isAmex ? 4 : 3;
  const regex = new RegExp(`^\\d{${length}}$`);
  
  if (!regex.test(cvv)) {
    return 'validation.cvvInvalid';
  }
  
  return null;
};

export const getCardType = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
  if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return 'diners';
  if (/^(?:2131|1800|35)/.test(cleanNumber)) return 'jcb';
  
  return 'unknown';
};