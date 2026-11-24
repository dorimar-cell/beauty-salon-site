# Изображения для SÉRAPHINE

Сайт уже полностью работает без фотографий: вместо них показываются «медальоны»
с монограммой и тёплым градиентом. Как только файл появляется в `public/images/`
под нужным именем — он подхватывается автоматически, без правок кода.

## Куда класть

```
public/images/
```

## Общая art direction (действует для всех кадров)

- Палитра: тёплый ivory `#F7F2EA`, шампань `#D9C4A9`, бронза `#A87E52`, тёмный ink `#17130F`, шалфей `#8C9A82`.
- Свет: мягкий рассеянный дневной, окно сбоку, без жёстких вспышек.
- Плёнка 35 мм, деликатное зерно, низкий контраст, «quiet luxury».
- Кожа живая: поры, веснушки, текстура. Без пластика и «AI-глянца».
- Никакого текста, логотипов, водяных знаков, рамок и коллажей.
- Композиция с воздухом: объект не должен занимать весь кадр.

## Список файлов

| Файл | Пропорции | Размер | Где используется | Кадрирование |
|---|---|---|---|---|
| `hero.jpg` | 4:5 | 1600×2000 | Первый экран, арка справа | Лицо в профиль, верхняя треть свободна |
| `interior.jpg` | 21:9 | 2400×1030 | Широкая полоса после цифр | Центр — арка/зеркало, по краям воздух |
| `master-alisa.jpg` | 3:4 | 1200×1600 | Карточка мастера | По пояс, глаза на уровне 40% сверху |
| `master-marina.jpg` | 3:4 | 1200×1600 | Карточка мастера | По пояс, руки в кадре |
| `master-dana.jpg` | 3:4 | 1200×1600 | Карточка мастера | По пояс, спокойная поза |
| `gallery-1.jpg` | 3:4 | 1200×1600 | Галерея, плитка 1 | Волосы, вид сзади/сбоку |
| `gallery-2.jpg` | 3:4 | 1200×1600 | Галерея, плитка 2 | Деталь интерьера |
| `gallery-3.jpg` | 3:4 | 1200×1600 | Галерея, плитка 3 | Руки, маникюр |
| `gallery-4.jpg` | 3:4 | 1200×1600 | Галерея, плитка 4 | Уход за лицом |
| `gallery-5.jpg` | 3:4 | 1200×1600 | Галерея, плитка 5 | Брови, макро |
| `gallery-6.jpg` | 3:4 | 1200×1600 | Галерея, плитка 6 | Вечерняя укладка |
| `og-image.jpg` | 1.91:1 | 1200×630 | Превью для соцсетей | Слева свободное поле под текст |

---

## Промпты

### 1. `hero.jpg`

> Editorial beauty photograph, vertical 4:5. Close-up of a woman's face in profile, eyes closed, luminous natural skin with visible texture and fine freckles, one dark strand of hair crossing the cheek, soft diffused window light from the left, warm ivory and champagne tones, muted bronze eyeshadow. Shot on 35mm film, shallow depth of field, delicate grain, quiet luxury beauty campaign, plain warm cream plaster wall background, no text, no logos, no watermark.

### 2. `interior.jpg`

> Wide architectural interior photograph, 21:9. Quiet-luxury beauty salon: warm cream microcement walls, two arched niches, large rounded antique mirror with thin brass frame, travertine counter, oatmeal bouclé chair, dried pampas in a ceramic vase, single olive tree. Late afternoon sunlight casting long soft shadows, no people, editorial magazine quality, muted ivory-bronze-sage palette, medium format look, no text, no logos.

### 3. `master-alisa.jpg`

> Editorial portrait, vertical 3:4. Female hair colorist, early 30s, dark hair in a low bun, black linen apron over a cream shirt, holding professional scissors loosely, standing in a warm minimal salon, soft window light, calm confident expression, looking slightly off camera. Natural skin texture, 35mm film grain, warm ivory and bronze palette, no text, no logos.

### 4. `master-marina.jpg`

> Editorial portrait, vertical 3:4. Female nail artist, late 20s, short dark bob, neat beige uniform, seated at a manicure table with hands visible, calm friendly expression, warm minimal studio, soft diffused daylight, shallow depth of field, natural skin texture, 35mm film grain, ivory and champagne palette, no text, no logos.

### 5. `master-dana.jpg`

> Editorial portrait, vertical 3:4. Female cosmetologist, mid 30s, hair pulled back, white cotton coat, standing beside a treatment bed in a warm minimal clinic, hands relaxed, serene professional expression, soft window light, natural skin texture, 35mm film grain, ivory-bronze palette, no text, no logos.

### 6. `gallery-1.jpg`

> Beauty editorial detail, vertical 3:4. Back view of long blonde balayage hair with soft dimension, a hand running through the ends, warm daylight from the side, visible hair texture and shine, cream background, 35mm film grain, luxury hair campaign, no face, no text, no logos.

### 7. `gallery-2.jpg`

> Interior detail, vertical 3:4. Arched plaster niche with a brass-framed round mirror, travertine shelf, ceramic vase with dried pampas, warm afternoon shadow across the wall, minimal luxury, film grain, ivory and bronze palette, no people, no text.

### 8. `gallery-3.jpg`

> Macro beauty photograph, vertical 3:4. Elegant female hands resting on ivory linen, flawless glossy nude-pink almond manicure, one delicate gold ring, warm diffused light, visible skin texture, shallow depth of field, editorial nail campaign, champagne palette, no text, no logos.

### 9. `gallery-4.jpg`

> Spa editorial photograph, vertical 3:4. Woman lying on a treatment bed with eyes closed, therapist's hands applying a clear serum to her cheek, white towel, warm minimal room, soft side light, calm and clinical-luxury mood, natural skin texture, film grain, ivory palette, no text, no logos.

### 10. `gallery-5.jpg`

> Macro beauty photograph, vertical 3:4. Close-up of an eyebrow being shaped, fine hairs visible, natural skin texture with freckles, soft warm light, shallow depth of field, editorial beauty, neutral ivory background, film grain, no text, no logos.

### 11. `gallery-6.jpg`

> Beauty editorial photograph, vertical 3:4. Back view of an elegant evening updo, dark hair with a few loose strands, small pearl hairpin, bare shoulders in a silk dress, warm low light, cinematic and calm, 35mm film grain, bronze and ivory palette, no face, no text, no logos.

### 12. `og-image.jpg`

> Wide editorial composition, 1200×630. Woman's profile in soft warm light on the right third of the frame, large empty ivory wall on the left for a headline, minimal bronze and cream palette, film grain, quiet luxury beauty brand, no text, no logos.

---

## Негативный промпт (добавлять ко всем)

> text, letters, logo, watermark, signature, collage, split screen, oversaturated colors, plastic skin, heavy retouching, deformed hands, extra fingers, harsh flash, neon, cluttered background, low resolution, jpeg artifacts

## Проверка после загрузки

1. Файлы должны быть именно с этими именами и в `public/images/`.
2. Формат: `.jpg` (или поменяй расширение в `src/data.ts` / компонентах, если `.png`).
3. Открой сайт: плейсхолдер исчезнет сам. Если файл битый — вернётся медальон, ошибок в консоли не будет.
