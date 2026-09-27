import test from 'node:test';
import assert from 'node:assert/strict';
import { profileSchema } from '../src/validation/profileSchema.js';
const valid = { name: 'Анна', email: 'anna@example.com', password: 'Example123', confirmPassword: 'Example123', consent: true };
test('Yup accepts and normalizes valid values', async () => {
  const values = await profileSchema.validate({ ...valid, name: ' Анна ', email: 'ANNA@EXAMPLE.COM' });
  assert.equal(values.name, 'Анна'); assert.equal(values.email, 'anna@example.com');
});
test('Yup rejects empty required fields', async () => { assert.equal(await profileSchema.isValid({}), false); });
test('Yup rejects wrong email, password mismatch and missing consent', async () => {
  for (const change of [{ email: 'invalid' }, { password: 'short' }, { confirmPassword: 'Wrong123' }, { consent: false }, { name: ' ' }]) {
    assert.equal(await profileSchema.isValid({ ...valid, ...change }), false);
  }
});
