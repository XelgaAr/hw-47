import test from 'node:test';
import assert from 'node:assert/strict';
import { validateName, validateEmail, validatePassword, validatePhone, normalizePhone, validateBirthDate, publicProfile, hookFormRules, passwordChecks } from '../../src/lib/validation.js';

test('name limits and trim', () => {
  assert.equal(validateName('  Анна  '), true);
  assert.notEqual(validateName('   '), true);
  assert.notEqual(validateName('А'), true);
  assert.notEqual(validateName('a'.repeat(51)), true);
});
test('email requires a plausible full address', () => {
  assert.equal(validateEmail(' anna@example.com '), true);
  for (const value of ['', 'invalid', 'a@b', 'x y@example.com']) assert.notEqual(validateEmail(value), true);
});
test('password enforces all documented rules', () => {
  assert.equal(validatePassword('Example123'), true);
  assert.equal(validatePassword('Пример123'), true);
  for (const value of ['', 'abc123', 'abcdefgh', '12345678', 'Example 12', 'a'.repeat(73)]) assert.notEqual(validatePassword(value), true);
  assert.ok(passwordChecks('Example123').every((rule) => rule.passed));
});
test('phone supports formatting but rejects incomplete or alphabetic input', () => {
  assert.equal(normalizePhone('+380 (67) 123-45-67'), '+380671234567');
  assert.equal(validatePhone('+380 (67) 123-45-67'), true);
  for (const value of ['', '0671234567', '+123', '+0123456789', '+380ABC12345', '+1234567890123456']) assert.notEqual(validatePhone(value), true);
});
test('birth date validates calendar, leap years and future dates', () => {
  const now = new Date('2026-05-10T12:00:00Z');
  assert.equal(validateBirthDate('2000-02-29', now), true);
  assert.equal(validateBirthDate('2026-05-10', now), true);
  for (const value of ['', '2001-02-29', '2020-13-01', '2026-05-11', '1899-12-31', '01.01.2000']) assert.notEqual(validateBirthDate(value, now), true);
});
test('result contains no password, confirmation or other input fields', () => {
  const value = publicProfile({ name: ' Анна ', email: ' A@EXAMPLE.COM ', password: 'NeverStore123', confirmPassword: 'NeverStore123', consent: true, phone: '+380 (67) 123-45-67', birthDate: '2000-01-01', injected: 'x' });
  assert.deepEqual(value, { name: 'Анна', email: 'a@example.com', phone: '+380671234567', birthDate: '2000-01-01' });
  assert.equal(JSON.stringify(value).includes('NeverStore'), false);
});
test('RHF confirmation depends on current password and consent is mandatory', () => {
  const rules = hookFormRules(() => 'Changed123');
  assert.equal(rules.confirmPassword.validate('Changed123'), true);
  assert.notEqual(rules.confirmPassword.validate('Old12345'), true);
  assert.notEqual(rules.consent.validate(false), true);
  assert.deepEqual(rules.password.deps, ['confirmPassword']);
});
