import { object, string, boolean, ref } from 'yup';
import { EMAIL_PATTERN } from '../lib/validation.js';

export const profileSchema = object({
  name: string().trim().min(2, 'Имя должно содержать от 2 до 50 символов.').max(50, 'Имя должно содержать от 2 до 50 символов.').required('Введите имя.'),
  email: string().trim().lowercase().email('Введите корректный email, например name@example.com.')
    .matches(EMAIL_PATTERN, 'Введите корректный email, например name@example.com.')
    .max(254, 'Email слишком длинный.').required('Введите электронную почту.'),
  password: string().min(8, 'Пароль должен содержать от 8 до 72 символов.').max(72, 'Пароль должен содержать от 8 до 72 символов.')
    .matches(/^\S+$/u, 'Пароль не должен содержать пробелы.')
    .test('letter-and-digit', 'Добавьте хотя бы одну букву и одну цифру.', (value) => !value || /\p{L}/u.test(value) && /\d/.test(value))
    .required('Введите тестовый пароль.'),
  confirmPassword: string().oneOf([ref('password')], 'Пароли не совпадают.').required('Повторите пароль.'),
  consent: boolean().oneOf([true], 'Подтвердите обработку тестовых данных в этой вкладке.').required(),
});
