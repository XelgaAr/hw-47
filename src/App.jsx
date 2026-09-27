import { useRef, useState } from 'react';
import FormikForm from './components/FormikForm.jsx';
import HookForm from './components/HookForm.jsx';

const TABS = ['Formik + Yup', 'React Hook Form'];
export default function App() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const navigate = (event, index) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % TABS.length;
    else if (event.key === 'ArrowLeft') next = (index + TABS.length - 1) % TABS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TABS.length - 1;
    else return;
    event.preventDefault(); setActive(next); tabs.current[next]?.focus();
  };
  return <div className="forma-shell">
    <a className="skip-link" href="#forms">Перейти к форме</a>

    <header className="site-header">
      <a className="brand" href="./"><span className="brand-symbol" aria-hidden="true">f</span>forma<span>.</span></a>
      <span className="header-note">Небольшая форма. Большое внимание к деталям.</span>
      <span className="header-badge">FORM STUDIO</span>
    </header>

    <main className="main-layout">
      <section className="intro-panel">
        <div>
          <span className="eyebrow">ЗНАКОМСТВО НАЧИНАЕТСЯ ЗДЕСЬ</span>
          <h1>Хорошее начало —<br /><em>это просто.</em></h1>
          <p className="intro-text">Две формы, понятные подсказки и никаких лишних шагов. Заполните профиль и сразу увидите результат.</p>
        </div>

        <div className="abstract-card" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="orbit-dot" />
          <span className="floating-label">Всё на своих местах <b>✓</b></span>
          <span className="abstract-caption">YOUR NEXT CHAPTER</span>
        </div>

        <div className="feature-list">
          <div>
            <span>01</span>
            <p><strong>Проверка рядом с полем</strong>Сообщения подскажут, что исправить.</p>
          </div>
          <div>
            <span>02</span>
            <p><strong>Независимое состояние</strong>Переключайте формы — введённое останется.</p>
          </div>
          <div>
            <span>03</span>
            <p><strong>Без отправки на сервер</strong>Результат хранится только в этой вкладке.</p>
          </div>
        </div>

        <p className="demo-note">Это демонстрация форм, а не регистрация аккаунта. Используйте тестовые данные и пароль.</p>

      </section>

      <section className="form-card" id="forms" aria-label="Формы профиля">
        <div role="tablist" aria-label="Библиотека формы" className="form-tabs">
          {TABS.map((label, index) => <button
            key={label}
            ref={(element) => { tabs.current[index] = element; }}
            id={`tab-${index}`}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => navigate(event, index)}
          >{label}</button>)}
        </div>

        <div className="form-body">
          <div id="panel-0" role="tabpanel" aria-labelledby="tab-0" hidden={active !== 0}>
            <FormikForm />
          </div>
          <div id="panel-1" role="tabpanel" aria-labelledby="tab-1" hidden={active !== 1}>
            <HookForm />
          </div>
        </div>

        <div className="form-card-footer"><span className="privacy-dot" />Без API, аналитики и постоянного хранения данных</div>

      </section>
    </main>

    <footer className="site-footer">
      <span>Forma · Практика работы с формами</span>
      <span>React · Formik · Yup · React Hook Form</span>
    </footer>

  </div>;
}
