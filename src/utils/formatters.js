/**
 * Format a card number with spaces every 4 digits
 * e.g. "1234567890123456" → "1234 5678 9012 3456"
 */
export const fmtCard = (v) =>
  v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

/**
 * Format expiry date as MM/YY
 * e.g. "1225" → "12/25"
 */
export const fmtExp = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
};

/**
 * Format DNI: digits only, max 8 chars
 */
export const fmtDNI = (v) => v.replace(/\D/g, '').slice(0, 8);

/**
 * Format a number as Argentine peso/USD string
 * e.g. 2499 → "$2,499"
 */
export const fmt$ = (n) => '$' + n.toLocaleString('es-AR');

/**
 * Detect card brand from number prefix
 * Returns: 'visa' | 'mastercard' | 'amex'
 */
export const detectBrand = (num) => {
  const d = num.replace(/\s/g, '');
  if (d.startsWith('4')) return 'visa';
  if (d.startsWith('5') || d.startsWith('2')) return 'mastercard';
  if (d.startsWith('3')) return 'amex';
  return 'visa';
};

/**
 * Generate a random 8-digit Pago Fácil code
 */
export const genPagoFacilCode = () =>
  Math.floor(10000000 + Math.random() * 90000000).toString();

/**
 * Generate a random order number
 */
export const genOrderNum = () =>
  '#NX-' + Math.floor(100000 + Math.random() * 900000);
