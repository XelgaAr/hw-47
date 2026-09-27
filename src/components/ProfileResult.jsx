export default function ProfileResult({ profile, library, onAgain }) {
  return <section className="profile-result" aria-label={`Результат ${library}`}>

    <span className="success-mark" aria-hidden="true">✓</span>
    <span className="eyebrow">ВСЁ ПОЛУЧИЛОСЬ</span>

    <h2>Профиль проверен</h2>
    <p role="status">Данные прошли валидацию и сохранены в локальном состоянии этой формы.</p>

    <dl><div>
      <dt>Имя</dt>
      <dd>{profile.name}</dd>
    </div><div>
        <dt>Электронная почта</dt>
        <dd>{profile.email}</dd>
      </div>
      {profile.phone && <div>
        <dt>Телефон</dt>
        <dd>{profile.phone}</dd>
      </div>}{profile.birthDate && <div>
        <dt>Дата рождения</dt>
        <dd>{profile.birthDate.split('-').reverse().join('.')}</dd>
      </div>}
    </dl>
    <div className="privacy-note">Пароль не включён в результат, не записан в хранилище или консоль. После отправки поля формы очищены.</div>

    <button className="submit-button" type="button" onClick={onAgain}>Заполнить ещё раз <span aria-hidden="true">↗</span></button>

  </section>;
}
