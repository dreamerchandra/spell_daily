export const getPhoneNumber = (str: string): string | null => {
  const text = str.trim().replace(/\s+/g, '');
  if (!text) return null;

  if (/^\d{10}$/.test(text)) {
    return text;
  }

  if (/^\+91\d{10}$/.test(text)) {
    return text.slice(3);
  }

  return null;
};
