import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { profileSchema } from '../validation/profileSchema.js';
import { EMPTY_PROFILE, publicProfile } from '../lib/validation.js';
import Field from './Field.jsx';
import Consent from './Consent.jsx';
import PasswordChecklist from './PasswordChecklist.jsx';
import ProfileResult from './ProfileResult.jsx';

export default function FormikForm() {
  const [profile, setProfile] = useState(null);
  const handledSubmit = useRef(0);
  const formik = useFormik({
    initialValues: { ...EMPTY_PROFILE }, validationSchema: profileSchema,
    validateOnBlur: true, validateOnChange: true,
    onSubmit(values, helpers) {
      setProfile(publicProfile(values));
      helpers.resetForm();
      helpers.setSubmitting(false);
    },
  });
  const { submitCount, isSubmitting, isValidating, errors } = formik;
  useEffect(() => {
    if (submitCount === 0) { handledSubmit.current = 0; return; }
    if (isSubmitting || isValidating || submitCount <= handledSubmit.current) return;
    handledSubmit.current = submitCount;
    const first = Object.keys(errors)[0];
    if (first) document.getElementById(`formik-${first}`)?.focus();
  }, [submitCount, isSubmitting, isValidating, errors]);
  const error = (name) => formik.touched[name] ? formik.errors[name] : undefined;
  if (profile) return <ProfileResult profile={profile} library="Formik" onAgain={() => setProfile(null)} />;
  return <form noValidate onSubmit={formik.handleSubmit} aria-label="Форма Formik">

    <div className="form-intro">
      <span className="form-number">01 / БАЗОВЫЙ ПРОФИЛЬ</span>
      <h2>Давайте познакомимся</h2>
      <p>Управление формой — Formik. Правила валидации — Yup.</p>
    </div>

    <Field
      label="Имя"
      id="formik-name"
      placeholder="Как к вам обращаться"
      autoComplete="given-name"
      maxLength={50}
      required
      {...formik.getFieldProps('name')}
      error={error('name')}
    />

    <Field
      label="Электронная почта"
      id="formik-email"
      type="email"
      placeholder="name@example.com"
      autoComplete="email"
      maxLength={254}
      required
      {...formik.getFieldProps('email')}
      error={error('email')}
    />

    <Field
      label="Пароль"
      id="formik-password"
      type="password"
      placeholder="Придумайте тестовый пароль"
      autoComplete="new-password"
      maxLength={72}
      required
      {...formik.getFieldProps('password')}
      error={error('password')}
    />

    <PasswordChecklist password={formik.values.password} />

    <Field
      label="Подтверждение пароля"
      id="formik-confirmPassword"
      type="password"
      placeholder="Повторите пароль"
      autoComplete="new-password"
      maxLength={72}
      required
      {...formik.getFieldProps('confirmPassword')}
      error={error('confirmPassword')}
    />

    <Consent
      id="formik-consent"
      name="consent"
      checked={formik.values.consent}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={error('consent')}
      required
    />

    <button className="submit-button" type="submit" disabled={formik.isSubmitting}>Проверить и сохранить <span aria-hidden="true">↗</span></button>

    <button className="reset-button" type="button" onClick={() => formik.resetForm()}>Очистить форму</button>

  </form>;
}
