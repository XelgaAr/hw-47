import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { EMPTY_EXTENDED_PROFILE, hookFormRules, publicProfile, todayISO } from '../lib/validation.js';
import Field from './Field.jsx';
import Consent from './Consent.jsx';
import PasswordChecklist from './PasswordChecklist.jsx';
import ProfileResult from './ProfileResult.jsx';

export default function HookForm() {
  const [profile, setProfile] = useState(null);
  const { register, handleSubmit, getValues, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { ...EMPTY_EXTENDED_PROFILE }, mode: 'onTouched', reValidateMode: 'onChange', shouldFocusError: true,
  });
  const password = useWatch({ control, name: 'password', defaultValue: '' });
  const rules = hookFormRules(getValues);
  const submit = (values) => { setProfile(publicProfile(values)); reset({ ...EMPTY_EXTENDED_PROFILE }); };
  if (profile) return <ProfileResult profile={profile} library="React Hook Form" onAgain={() => setProfile(null)} />;
  return <form noValidate onSubmit={handleSubmit(submit)} aria-label="Форма React Hook Form">

    <div className="form-intro">
      <span className="form-number">02 / РАСШИРЕННЫЙ ПРОФИЛЬ</span>
      <h2>Чуть больше о вас</h2>
      <p>Независимая форма с встроенной валидацией React Hook Form.</p>
    </div>

    <Field
      label="Имя"
      id="rhf-name"
      placeholder="Как к вам обращаться"
      autoComplete="given-name"
      maxLength={50}
      required
      {...register('name', rules.name)}
      error={errors.name?.message}
    />

    <Field
      label="Электронная почта"
      id="rhf-email"
      type="email"
      placeholder="name@example.com"
      autoComplete="email"
      maxLength={254}
      required
      {...register('email', rules.email)}
      error={errors.email?.message}
    />

    <div className="fields-grid">
      <Field
        label="Телефон"
        id="rhf-phone"
        type="tel"
        placeholder="+380 67 123 45 67"
        autoComplete="tel"
        hint="Код страны и 7–15 цифр"
        maxLength={30}
        required
        {...register('phone', rules.phone)}
        error={errors.phone?.message}
      />

      <Field
        label="Дата рождения"
        id="rhf-birthDate"
        type="date"
        autoComplete="bday"
        min="1900-01-01"
        max={todayISO()}
        required
        {...register('birthDate', rules.birthDate)}
        error={errors.birthDate?.message}
      />
    </div>

    <Field
      label="Пароль"
      id="rhf-password"
      type="password"
      placeholder="Придумайте тестовый пароль"
      autoComplete="new-password"
      maxLength={72}
      required
      {...register('password', rules.password)}
      error={errors.password?.message}
    />

    <PasswordChecklist password={password} />

    <Field
      label="Подтверждение пароля"
      id="rhf-confirmPassword"
      type="password"
      placeholder="Повторите пароль"
      autoComplete="new-password"
      maxLength={72}
      required
      {...register('confirmPassword', rules.confirmPassword)}
      error={errors.confirmPassword?.message}
    />

    <Consent id="rhf-consent" {...register('consent', rules.consent)} error={errors.consent?.message} required />

    <button className="submit-button" type="submit" disabled={isSubmitting}>Проверить и сохранить <span aria-hidden="true">↗</span></button>

    <button className="reset-button" type="button" onClick={() => reset({ ...EMPTY_EXTENDED_PROFILE })}>Очистить форму</button>

  </form>;
}
