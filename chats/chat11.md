# Адаптив для заявки

_Started 2026-05-25 12:21 UTC_

---

## User

Добавь адаптив на 768 px для главного экрана прототипа (страница «Новая заявка») 
точно по дизайну из Figma (скрин). Скидываю на всякий случай HTML и CSS этого масштаба

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: grep]_

_[tool: read_file]_

_[tool: view_image]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Now I understand the structure. Looking at the Figma screenshot, at 768px I need:

1. **Order item rows** stack vertically: Product → Container → [Stepper + Delete] → Frozen checkbox
2. **«Способ получения» + «Дата отгрузки»** stack vertically (instead of side-by-side)
3. Right column (Оформить заявку + Alert) **stays visible** side-by-side

Let me add the 768px breakpoint to the existing media queries:

_[tool: done]_

_[tool: fork_verifier_agent]_

Готово — добавил `@media (max-width: 768px)` в `Order System.html`. Изменения по Figma:

- **Позиция заказа**: «Продукт» (full-width) → «Тара» (full-width) → строка `[− N +]` слева + `🗑` справа → «Замороженное»
- **Способ получения** + **Дата отгрузки** — стек по вертикали
- Правая колонка (Оформить заявку + alert) остаётся справа, мобильная шапка с бургером уже работала с брейка 1024px

## User

Verifier agent check completed

## Assistant

Верификатор подтвердил — адаптив на 768px работает по макету.

