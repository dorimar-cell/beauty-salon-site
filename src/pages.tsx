import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CONTACTS, MASTERS, PRICE_GROUPS } from "./data";
import {
  Booking,
  ContactsSection,
  FaqSection,
  Gallery,
  Hero,
  MarqueeStrip,
  MastersSection,
  Philosophy,
  Reviews,
  Ritual,
  ServicesSection,
} from "./components/sections";
import { Marquee, Photo, Reveal } from "./components/ui";

/* ---------------- HOME ---------------- */

export function Home() {
  return (
    <div className="page">
      <Hero />
      <MarqueeStrip />
      <Philosophy />
      <ServicesSection />
      <Ritual />
      <MastersSection />
      <Gallery />
      <Reviews />
      <ContactsSection />
      <Booking />
    </div>
  );
}

/* ---------------- SERVICES ---------------- */

export function ServicesPage() {
  const [active, setActive] = useState(PRICE_GROUPS[0].id);
  const group = PRICE_GROUPS.find((g) => g.id === active) ?? PRICE_GROUPS[0];

  return (
    <div className="page">
      <section className="page-hero">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Услуги и цены</span>
          </Reveal>
          <Reveal delay={80}>
            <h1>Прайс без звёздочек и «от» мелким шрифтом</h1>
          </Reveal>
          <div className="page-hero__row mt-24">
            <Reveal delay={140}>
              <p>
                Итоговую сумму мастер называет до начала работы — после
                диагностики. Если что-то не нужно, мы не будем это продавать.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <Link to="/contacts" className="btn">
                <span>Записаться</span>
                <ArrowUpRight size={15} strokeWidth={1.6} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee items={["Волосы", "Ногти", "Лицо", "Брови", "Ресницы"]} dark />

      <section className="section section--tight">
        <div className="wrap">
          <div className="tabs" role="tablist" aria-label="Категории услуг">
            {PRICE_GROUPS.map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={active === g.id}
                className={`tab ${active === g.id ? "is-active" : ""}`}
                onClick={() => setActive(g.id)}
              >
                {g.title}
              </button>
            ))}
          </div>

          <p className="muted small" style={{ marginBottom: 18 }}>
            {group.caption}
          </p>

          <motion.div
            key={group.id}
            className="price-grid"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {group.items.map((item) => (
              <div className="price-row" key={item.name}>
                <div>
                  <span className="price-row__name">{item.name}</span>
                  {item.note ? <span className="price-row__note">{item.note}</span> : null}
                </div>
                <span className="price-row__price">{item.price}</span>
              </div>
            ))}
          </motion.div>

          <div className="mini-note mt-40">
            <span>ⓘ</span>
            <span>
              Цены действуют с 1 ноября 2026 года. Сложное окрашивание
              рассчитывается после тест-пряди: длина и плотность волос влияют на
              расход состава. Тест-прядь — бесплатно.
            </span>
          </div>
        </div>
      </section>

      <FaqSection />
      <Booking compact />
    </div>
  );
}

/* ---------------- MASTERS ---------------- */

export function MastersPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Команда</span>
          </Reveal>
          <Reveal delay={80}>
            <h1>Девять мастеров. У каждого своя школа</h1>
          </Reveal>
          <div className="page-hero__row mt-24">
            <Reveal delay={140}>
              <p>
                Мы не публикуем всех: у каждого мастера своя загрузка и свой
                профиль. Скажите задачу — администратор подберёт того, кто
                делает именно это каждый день.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="masters__grid">
            {MASTERS.map((m, i) => (
              <Reveal key={m.id} delay={i * 90}>
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

          <div className="stats mt-40">
            {[
              { value: "9", label: "мастеров в команде" },
              { value: "7", label: "лет — средний стаж" },
              { value: "82%", label: "клиентов возвращаются" },
              { value: "4,9", label: "средняя оценка" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 60} className="stat">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="philosophy">
            <Reveal>
              <span className="eyebrow">Как мы выбираем</span>
              <h2 style={{ marginTop: 18 }}>Не по портфолио в Instagram</h2>
            </Reveal>
            <div className="philosophy__body">
              <Reveal delay={100}>
                <p>
                  Каждый мастер проходит два тестовых дня и одну работу на модели
                  под наблюдением. Мы смотрим не на скорость, а на то, как человек
                  разговаривает с клиентом и что делает, когда что-то пошло не по
                  плану.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <p>
                  Поэтому у нас нет «стажёров за полцены» и нет мастеров, которых
                  вы видите впервые в день визита. Если вам не подошёл мастер — мы
                  не спорим и не уговариваем. Просто подберём другого.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Booking compact />
    </div>
  );
}

/* ---------------- CONTACTS ---------------- */

export function ContactsPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Контакты</span>
          </Reveal>
          <Reveal delay={80}>
            <h1>Приходите. Мы не кусаемся</h1>
          </Reveal>
          <div className="page-hero__row mt-24">
            <Reveal delay={140}>
              <p>
                {CONTACTS.city}, {CONTACTS.address}. {CONTACTS.hours}. Телефон{" "}
                <a href={CONTACTS.phoneHref} style={{ borderBottom: "1px solid var(--line)" }}>
                  {CONTACTS.phone}
                </a>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactsSection showHead={false} />
      <Booking />
    </div>
  );
}

/* ---------------- 404 ---------------- */

export function NotFound() {
  return (
    <div className="page">
      <section className="section" style={{ paddingTop: 180 }}>
        <div className="wrap center">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            404
          </span>
          <h1 style={{ marginTop: 18 }}>Такой страницы нет</h1>
          <p className="muted" style={{ marginTop: 18 }}>
            Возможно, ссылка устарела. Вернитесь на главную — там всё на месте.
          </p>
          <div className="mt-40">
            <Link to="/" className="btn">
              <span>На главную</span>
              <ArrowUpRight size={15} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
