import { test, expect } from '@playwright/test';
async function fillBase(panel) {
  await panel.getByLabel('Имя', { exact: false }).fill('Анна');
  await panel.getByLabel('Электронная почта', { exact: false }).fill('anna@example.com');
  await panel.locator('input[name="password"]').fill('Example123');
  await panel.locator('input[name="confirmPassword"]').fill('Example123');
  await panel.getByRole('checkbox').check();
}
test('Formik validates, submits safely and resets', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  const panel = page.getByRole('tabpanel', { name: 'Formik + Yup' });
  await panel.getByRole('button', { name: 'Проверить и сохранить' }).click();
  await expect(panel.getByRole('alert').first()).toBeVisible();
  await fillBase(panel);
  await panel.getByRole('button', { name: 'Проверить и сохранить' }).click();
  await expect(panel.getByRole('heading', { name: 'Профиль проверен' })).toBeVisible();
  await expect(panel).toContainText('anna@example.com');
  await expect(panel).not.toContainText('Example123');
  await panel.getByRole('button', { name: 'Заполнить ещё раз' }).click();
  await expect(panel.locator('input[name="password"]')).toHaveValue('');
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('forms preserve independent drafts and independent results', async ({ page }) => {
  await page.goto('./');
  const formik = page.getByRole('tabpanel', { name: 'Formik + Yup' });
  await formik.locator('input[name="name"]').fill('Черновик Formik');
  await page.getByRole('tab', { name: 'React Hook Form', exact: true }).click();
  const rhf = page.getByRole('tabpanel', { name: 'React Hook Form', exact: true });
  await expect(rhf.locator('input[name="name"]')).toHaveValue('');
  await fillBase(rhf);
  await rhf.getByLabel('Телефон').fill('+380 67 123 45 67');
  await rhf.getByLabel('Дата рождения').fill('2000-02-29');
  await rhf.getByRole('button', { name: 'Проверить и сохранить' }).click();
  await expect(rhf.getByRole('heading', { name: 'Профиль проверен' })).toBeVisible();
  await expect(rhf).toContainText('+380671234567');
  await page.getByRole('tab', { name: 'Formik + Yup' }).click();
  await expect(formik.locator('input[name="name"]')).toHaveValue('Черновик Formik');
  await page.getByRole('tab', { name: 'React Hook Form', exact: true }).click();
  await expect(rhf.getByRole('heading', { name: 'Профиль проверен' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Давайте познакомимся' })).toBeVisible();
});
test('RHF rejects invalid extra fields and password confirmation', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('tab', { name: 'React Hook Form', exact: true }).click();
  const panel = page.getByRole('tabpanel', { name: 'React Hook Form', exact: true });
  await fillBase(panel);
  await panel.getByLabel('Телефон').fill('123');
  await panel.getByLabel('Дата рождения').fill('2099-01-01');
  await panel.locator('input[name="confirmPassword"]').fill('Different123');
  await panel.getByRole('button', { name: 'Проверить и сохранить' }).click();
  await expect(panel.getByText('Пароли не совпадают.', { exact: true })).toBeVisible();
  await expect(panel.getByText('Используйте международный формат: + и от 7 до 15 цифр.', { exact: true })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Профиль проверен' })).toHaveCount(0);
});
