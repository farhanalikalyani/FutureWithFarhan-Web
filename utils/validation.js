export function validateEmail(email) {
  if (!email?.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length > 128) return "Password is too long";
  return null;
}

export function validateName(name) {
  if (!name?.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (name.trim().length > 50) return "Name is too long";
  return null;
}

export function validateURL(url) {
  if (!url?.trim()) return "URL is required";
  try {
    new URL(url);
    return null;
  } catch {
    return "Enter a valid URL (https://...)";
  }
}

export function validateRequired(value, fieldName) {
  if (!value?.trim()) return `${fieldName} is required`;
  return null;
}
