import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import {
  CONTACTS,
  FAQ,
  GALLERY,
  MASTERS,
  SERVICES,
  STATS,
  STEPS,
  TESTIMONIALS,
} from "../data";
import {
  Accordion,
  CircularCarousel,
  DateField,
  Magnetic,
  Marquee,
  Photo,
  Reveal,
  SelectField,
  SplitText,
  Stars,
  Tilt,
} from "./ui";

/* ================= HERO ================= */

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    const particles = Array.from({ length: 54 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.4,
      vy: -(Math.random() * 0.1 + 0.02),
      vx: (Math.random() - 0.5) * 0.05,
      a: Math.random() * 0.4 + 0.1,
    }));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy / 100;
        p.x += p.vx / 100;
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = Math.random();
        }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        const x = p.x * w;
        const y = p.y * h;
        const rad = p.r * 4.2;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(168,126,82,${p.a * 0.55})`);
        g.addColorStop(1, "rgba(168,126,82,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero__canvas" aria-hidden="true" />;
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" />
      <HeroCanvas />
      <div className="wrap hero__grid">
        <div>
          <Reveal>
            <span className="eyebrow">Москва · Патриаршие пруды</span>
          </Reveal>

          <h1 className="hero__title">
            <span className="line">
              <span>Красота,</span>
            </span>
            <span className="line">
              <span>которая</span>
            </span>
            <span className="line">
              <span>
                не <em>кричит</em>
              </span>
            </span>
          </h1>

          <Reveal delay={520}>
            <p className="hero__sub">
              Тихая студия на Патриарших: стрижка, окрашивание, маникюр и уход.
              Один мастер — один клиент. Без спешки, без конвейера и без
              обещаний, которые нечем подтвердить.
            </p>
          </Reveal>

          <Reveal delay={620}>
            <div className="hero__cta">
              <Magnetic>
                <Link to="/contacts" className="btn">
                  <span>Записаться</span>
                  <ArrowUpRight size={15} strokeWidth={1.6} />
                </Link>
              </Magnetic>
              <Magnetic strength={0.16}>
                <Link to="/services" className="btn btn--ghost">
                  <span>Услуги и цены</span>
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={720}>
            <div className="hero__meta">
              <Stars />
              <span>4,9 · 312 отзывов · 12 лет на Патриарших</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300} className="hero__frame">
          <div className="hero__arch">
            <Photo src="/images/hero.jpg" alt="Портрет клиентки студии Séraphine" tone={1} monogram="S" />
            <div className="hero__arch-caption">
              <span>Séraphine</span>
              <span>Est. 2014</span>
            </div>
          </div>
          <div className="hero__badge">
            <b>4,9 / 5</b>
            <span>Яндекс · 312 отзывов</span>
          </div>
        </Reveal>
      </div>

      <div className="hero__scroll">
        <i />
        <span>Листайте</span>
      </div>
    </section>
  );
}

/* ================= PHILOSOPHY ================= */

export function Philosophy() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="philosophy">
          <Reveal>
            <span className="eyebrow">О студии</span>
            <p className="philosophy__statement">
              <SplitText text="Мы не делаем «вау» за пять минут." />
              <br />
              <SplitText
                text="Мы делаем так, чтобы через неделю вам всё ещё нравилось."
                stagger={28}
              />
            </p>
          </Reveal>

          <div className="philosophy__body">
            <Reveal delay={120}>
              <p>
                Séraphine появилась в 2014 году как маленькая комната на двоих.
                Сегодня это девять мастеров, две зоны и одно правило: клиент не
                ждёт в коридоре, пока мастер «доделает другого».
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p>
                Мы работаем по записи с запасом времени. Поэтому здесь не бывает
                очередей, суеты и разговоров через голову. Только вы, мастер и
                тишина, в которой можно выдохнуть.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <p className="muted small">
                Лицензия на медицинскую деятельность · договор и чеки на каждую
                услугу · стерилизация инструмента в крафт-пакетах при вас.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className="stat">
              <b>{s.value}</b>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>

        <div className="space mt-40">
          <Reveal>
            <div className="space__text">
              <span className="eyebrow">Пространство</span>
              <h2>Две зоны, один ритм</h2>
              <p>
                Светлая зона для волос и ногтей, тихая — для косметологии.
                Никаких пересечений: пока вы в кресле, рядом не запускают
                следующего гостя.
              </p>
              <ul className="space__list">
                <li>
                  <span>01</span> Отдельный вход и гардероб
                </li>
                <li>
                  <span>02</span> Кофе, вода и тишина без музыки из колонки
                </li>
                <li>
                  <span>03</span> Стерилизация инструмента при вас
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <figure className="space__frame" style={{ margin: 0 }}>
              <Photo
                src="/images/interior.jpg"
                alt="Интерьер студии Séraphine на Малой Бронной"
                tone={2}
                monogram="S"
              />
              <figcaption className="space__caption">
                <span>Студия · Малая Бронная, 12</span>
                <span>2014 — 2026</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= SERVICES ================= */

export function ServicesSection() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">Услуги</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Шесть вещей, которые мы делаем хорошо</h2>
            </Reveal>
          </div>
          <Reveal delay={160} className="section-head__side">
            Полный прайс — на отдельной странице. Цены финальные: мастер
            называет сумму до начала работы, а не после.
          </Reveal>
        </div>

        <div className="services__grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 90}>
              <Tilt max={4}>
                <Link to="/services" className="service-card">
                  <span className="service-card__wash" aria-hidden="true" />
                  <div className="service-card__top">
                    <span>{s.index}</span>
                    <span>{s.duration}</span>
                  </div>
                  <div className="service-card__title">
                    <h3>{s.title}</h3>
                  </div>
                  <p>{s.tagline}</p>
                  <ul className="service-card__bullets">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="service-card__foot">
                    <span className="service-card__price">{s.price}</span>
                    <span className="service-card__arrow">
                      <ArrowUpRight size={15} strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-40">
            <Magnetic strength={0.18}>
              <Link to="/services" className="link-arrow">
                Полный прайс-лист
                <ArrowUpRight size={15} strokeWidth={1.6} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= RITUAL ================= */

export function Ritual() {
  return (
    <section className="section" id="ritual">
      <div className="wrap ritual">
        <div className="ritual__aside">
          <Reveal>
            <span className="eyebrow">Ритуал визита</span>
            <h2>Три шага, которые мы не сокращаем</h2>
            <p>
              Это не маркетинговая воронка. Это единственный способ делать
              предсказуемый результат в салоне, где люди не сменяются каждые
              полчаса.
            </p>
          </Reveal>
        </div>

        <div className="ritual__steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.index} delay={i * 90}>
              <article className="ritual-step">
                <span className="ritual-step__index">{s.index}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= MASTERS ================= */

export function MastersSection() {
  return (
    <section className="section" id="masters">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">Команда</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Люди, к которым возвращаются по имени</h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <Link to="/masters" className="link-arrow">
              Все мастера
              <ArrowUpRight size={15} strokeWidth={1.6} />
            </Link>
          </Reveal>
        </div>

        <div className="masters__grid">
          {MASTERS.map((m, i) => (
            <Reveal key={m.id} delay={i * 100}>
              <article className="master">
                <div className="master__frame">
                  <Photo
                    src={`/images/master-${m.id}.jpg`}
                    alt={m.name}
                    tone={m.tone}
                    monogram={m.name.slice(0, 1)}
                  />
                  <span className="master__years">{m.years}</span>
                </div>
                <div className="master__info">
                  <h3>{m.name}</h3>
                  <span className="master__role">{m.role}</span>
                  <div className="master__focus">
                    {m.focus.map((f) => (
                      <span className="chip" key={f}>
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="master__quote">«{m.quote}»</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= GALLERY ================= */

export function Gallery() {
  return (
    <section className="section--tight" id="gallery">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">Работы</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Без фильтров и «до/после» на коленке</h2>
            </Reveal>
          </div>
          <Reveal delay={140} className="section-head__side">
            Наведите — движение остановится. Всё снято в студии, при дневном
            свете, без ретуши формы.
          </Reveal>
        </div>
      </div>

      <div className="wrap">
        <CircularCarousel
          items={GALLERY.map((g, i) => ({
            src: `/images/gallery-${i + 1}.jpg`,
            label: g.label,
            meta: g.meta,
            tone: g.tone,
          }))}
        />
        <div className="gallery__hint" style={{ paddingLeft: 0 }}>
          <i />
          <span>Тяните мышью · нажмите на карточку, чтобы приблизить</span>
        </div>
      </div>
    </section>
  );
}

/* ================= REVIEWS ================= */

export function Reviews() {
  const [index, setIndex] = useState(0);
  const item = TESTIMONIALS[index];

  const go = (dir: number) => {
    setIndex((v) => (v + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="section reviews" id="reviews">
      <span className="reviews__mark" aria-hidden="true">
        “
      </span>
      <div className="wrap">
        <div className="reviews__head">
          <div>
            <Reveal>
              <span className="eyebrow">Отзывы</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 style={{ color: "var(--paper)", marginTop: 18 }}>
                312 отзывов. Читайте не рейтинг, а детали.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <div className="reviews__counter">
              {String(index + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
            </div>
          </Reveal>
        </div>

        <div className="reviews__stars">
          <Stars count={item.rating} />
        </div>

        <div className="reviews__stage">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={t.name}
              className={`reviews__item ${i === index ? "is-active" : ""}`}
              aria-hidden={i !== index}
            >
              <p className="quote">«{t.text}»</p>
              <footer className="quote__author">
                <i />
                <span>
                  {t.name} · {t.service}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="reviews__controls">
          <button className="dot-btn" onClick={() => go(-1)} aria-label="Предыдущий отзыв">
            <ArrowLeft size={15} strokeWidth={1.5} />
          </button>
          <button className="dot-btn" onClick={() => go(1)} aria-label="Следующий отзыв">
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
          <a
            className="reviews__counter"
            href="https://yandex.ru/maps"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "auto" }}
          >
            Все отзывы на Яндекс Картах ↗
          </a>
        </div>
      </div>
    </section>
  );
}

/* ================= BOOKING ================= */

type FormValues = {
  name: string;
  phone: string;
  service: string;
  date: string;
  comment: string;
};

export function Booking({ compact = false }: { compact?: boolean }) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    phone: "",
    service: "",
    date: "",
    comment: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (values.name.trim().length < 2) next.name = "Как к вам обращаться?";
    if (values.phone.replace(/\D/g, "").length < 11) next.phone = "Нужен номер из 11 цифр";
    if (!values.service) next.service = "Выберите услугу";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  return (
    <section className={`section booking ${compact ? "section--tight" : ""}`} id="booking">
      <div className="wrap booking__grid">
        <div>
          <Reveal>
            <span className="eyebrow" style={{ color: "rgba(247,242,234,.55)" }}>
              Запись
            </span>
            <h2>Оставьте номер, перезвоним за 15 минут</h2>
            <p className="booking__note">
              Свободные окна на этой неделе есть. Скажите, что хотите сделать, —
              подберём мастера и время, а не «ближайшее доступное».
            </p>
          </Reveal>
          <Reveal delay={140}>
            <ul className="booking__list">
              <li>Бесплатная консультация перед первой процедурой</li>
              <li>Отмена и перенос — за 24 часа, без штрафа</li>
              <li>Первое посещение — скидка 10% на уход</li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={180}>
          {sent ? (
            <div className="success">
              <span className="success__check">
                <Check size={22} strokeWidth={1.5} />
              </span>
              <h3 style={{ color: "var(--paper)" }}>Заявка принята</h3>
              <p style={{ color: "rgba(247,242,234,.65)", maxWidth: "36ch" }}>
                {values.name}, мы перезвоним на {values.phone} в течение 15 минут
                в рабочее время. Если срочно — {CONTACTS.phone}.
              </p>
              <button className="btn btn--light btn--sm" onClick={() => setSent(false)}>
                <span>Отправить ещё одну</span>
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="bf-name">Имя</label>
                <input
                  id="bf-name"
                  value={values.name}
                  onChange={set("name")}
                  placeholder="Анна"
                  autoComplete="name"
                />
                <span className="field__error">{errors.name}</span>
              </div>

              <div className="field">
                <label htmlFor="bf-phone">Телефон</label>
                <input
                  id="bf-phone"
                  value={values.phone}
                  onChange={set("phone")}
                  placeholder="+7 999 000-00-00"
                  inputMode="tel"
                  autoComplete="tel"
                />
                <span className="field__error">{errors.phone}</span>
              </div>

              <SelectField
                label="Услуга"
                value={values.service}
                error={errors.service}
                options={[...SERVICES.map((s) => s.title), "Пока не знаю"]}
                onChange={(v) => {
                  setValues((prev) => ({ ...prev, service: v }));
                  setErrors((er) => ({ ...er, service: "" }));
                }}
              />

              <DateField
                label="Удобная дата"
                value={values.date}
                onChange={(v) => setValues((prev) => ({ ...prev, date: v }))}
              />

              <div className="field field--full">
                <label htmlFor="bf-comment">Комментарий</label>
                <textarea
                  id="bf-comment"
                  rows={2}
                  value={values.comment}
                  onChange={set("comment")}
                  placeholder="Например: нужен сложный блонд, была неудачная попытка"
                />
              </div>

              <div className="form__foot">
                <button className="btn btn--light" type="submit">
                  <span>Отправить заявку</span>
                  <ArrowUpRight size={15} strokeWidth={1.6} />
                </button>
                <span className="form__legal">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                  Это демо-форма: данные никуда не отправляются.
                </span>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ================= CONTACTS ================= */

export function ContactsSection({ showHead = true }: { showHead?: boolean }) {
  return (
    <section className="section" id="contacts">
      <div className="wrap">
        {showHead ? (
          <div className="section-head">
            <div>
              <Reveal>
                <span className="eyebrow">Контакты</span>
              </Reveal>
              <Reveal delay={80}>
                <h2>Малая Бронная, 12</h2>
              </Reveal>
            </div>
            <Reveal delay={140} className="section-head__side">
              Семь минут от Маяковской. Дверь без вывески — это нормально, мы
              намеренно не кричим с улицы.
            </Reveal>
          </div>
        ) : null}

        <div className="contacts__grid">
          <Reveal>
            <dl className="contact-list">
              <div className="contact-row">
                <dt>Адрес</dt>
                <dd>
                  {CONTACTS.city}, {CONTACTS.address}
                  <br />
                  <span className="muted small">{CONTACTS.metro}</span>
                </dd>
              </div>
              <div className="contact-row">
                <dt>Часы</dt>
                <dd>{CONTACTS.hours}</dd>
              </div>
              <div className="contact-row">
                <dt>Телефон</dt>
                <dd>
                  <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
                </dd>
              </div>
              <div className="contact-row">
                <dt>Почта</dt>
                <dd>
                  <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
                </dd>
              </div>
              <div className="contact-row">
                <dt>Соцсети</dt>
                <dd style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {CONTACTS.socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={140}>
            <div className="map-card" role="img" aria-label="Схема расположения студии">
              <span className="map-card__pin" />
              <span className="map-card__label">Séraphine · М. Бронная 12</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ ================= */

export function FaqSection() {
  return (
    <section className="section section--tight" id="faq">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">Вопросы</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Отвечаем заранее</h2>
            </Reveal>
          </div>
        </div>
        <Reveal>
          <Accordion items={FAQ} />
        </Reveal>
      </div>
    </section>
  );
}

/* ================= MARQUEE ================= */

export const MarqueeStrip = () => (
  <Marquee
    items={[
      "Стрижка",
      "Окрашивание",
      "Маникюр",
      "Педикюр",
      "Уход за лицом",
      "Брови",
      "Ресницы",
      "Массаж лица",
    ]}
  />
);
