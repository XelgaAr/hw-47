export const EMPTY_PROFILE = { name: '', email: '', password: '', confirmPassword: '', consent: false };
export const EMPTY_EXTENDED_PROFILE = { ...EMPTY_PROFILE, phone: '', birthDate: '' };
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value) {
  const name = typeof value === 'string' ? value.trim() : '';
  if (!name) return 'Введите имя.';
  return name.length >= 2 && name.length <= 50 || 'Имя должно содержать от 2 до 50 символов.';
}
export function validateEmail(value) {
  const email = typeof value === 'string' ? value.trim() : '';
  if (!email) return 'Введите электронную почту.';
  return email.length <= 254 && EMAIL_PATTERN.test(email) || 'Введите корректный email, например name@example.com.';
}
export function validatePassword(value) {
  if (!value) return 'Введите тестовый пароль.';
  if (value.length < 8 || value.length > 72) return 'Пароль должен содержать от 8 до 72 символов.';
  if (/\s/u.test(value)) return 'Пароль не должен содержать пробелы.';
  return /\p{L}/u.test(value) && /\d/.test(value) || 'Добавьте хотя бы одну букву и одну цифру.';
}
export function normalizePhone(value) { return value.trim().replace(/[\s()-]/g, ''); }
export function validatePhone(value) {
  if (!value?.trim()) return 'Введите номер телефона.';
  if (!/^[+\d\s()-]+$/.test(value)) return 'Используйте международный формат: + и от 7 до 15 цифр.';
  return /^\+[1-9]\d{6,14}$/.test(normalizePhone(value)) || 'Используйте международный формат: + и от 7 до 15 цифр.';
}
export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export function validateBirthDate(value, now = new Date()) {
  if (!value) return 'Укажите дату рождения.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Укажите корректную дату.';
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return 'Такой даты не существует.';
  return value >= '1900-01-01' && value <= todayISO(now) || 'Дата должна быть не раньше 1900 года и не позже сегодняшнего дня.';
}
export function passwordChecks(value) {
  return [
    { label: 'От 8 до 72 символов', passed: value.length >= 8 && value.length <= 72 },
    { label: 'Буква и цифра', passed: /\p{L}/u.test(value) && /\d/.test(value) },
    { label: 'Без пробелов', passed: Boolean(value) && !/\s/u.test(value) },
  ];
}
/** Whitelist public fields: passwords and consent must not enter the result. */
export function publicProfile(values) {
  const result = { name: values.name.trim(), email: values.email.trim().toLowerCase() };
  if (Object.hasOwn(values, 'phone')) result.phone = normalizePhone(values.phone);
  if (Object.hasOwn(values, 'birthDate')) result.birthDate = values.birthDate;
  return result;
}
export function hookFormRules(getValues) {
  return {
    name: { validate: validateName },
    email: { validate: validateEmail },
    password: { validate: validatePassword, deps: ['confirmPassword'] },
    confirmPassword: { validate: (value) => !value ? 'Повторите пароль.' : value === getValues('password') || 'Пароли не совпадают.' },
    phone: { validate: validatePhone }, birthDate: { validate: (value) => validateBirthDate(value) },
    consent: { validate: (value) => value === true || 'Подтвердите обработку тестовых данных в этой вкладке.' },
  };
}
