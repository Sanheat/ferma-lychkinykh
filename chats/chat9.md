# Адаптив 1280px Figma

_Started 2026-05-25 11:40 UTC_

---

## User

Добавь адаптив на 1280 px для главного экрана прототипа (страница «Новая заявка») 
точно по дизайну из Figma (скрин). Скидываю на всякий случай HTML и CSS этого масштаба.

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: list_files]_

Looking at the existing setup. Let me check what V.1 and screenshots have for reference.

_[tool: image_metadata]_

_[tool: image_metadata]_

_[tool: view_image]_

_[tool: grep]_

Let me check the layout component to understand sidebar/main split.

_[tool: show_html]_

Let me preview the current state at 1280px to see what's broken.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

I see — at 1280px the Product/Tara selects collapse because there's not enough horizontal space for 4 controls in one row. Let me fix this by restructuring the line item to match Figma's nested layout at ≤1280px.Now restructure the React line item to match Figma's nested structure (Product stacked above Tara+Stepper at ≤1280px), and remove the wrong `input-dropdown-parent` class from the bottom delivery+date row (per Figma it stays horizontal):

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: view_image]_

_[tool: save_screenshot]_

The line item now stacks correctly at ≤1280px (Product on top, Tara+Stepper below). Let me verify the desktop view (>1280px) still works:

_[tool: save_screenshot]_

The structure is correct: above 1280px the `.input-dropdown-parent` is set to `flex-direction: row` inline, showing Product/Tara/Stepper/Delete in one row. At ≤1280px the @media flips it to column.

Let me also verify the full form at 1280px width with a navigated state:

_[tool: view_image]_

_[tool: eval_js]_

Let me inspect the DOM to see why Tara/Stepper aren't in a row:

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: save_screenshot]_

Found it — my earlier `all: revert` test hack got persisted in this iframe. Let me reload cleanly:

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js_user_view]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: screenshot_user_view]_

_[tool: done]_

The layout now matches the Figma design at ≤1280px:
- Sidebar shrinks to 280px
- Line item: **Продукт** stacks on top, **Тара + qty-stepper** below in a row (per Figma's `.input-dropdown-parent` column rule)
- Bottom row: **Способ получения** + **Дата отгрузки** stay horizontal
- All inner widths stretch via `width: auto` rules from the @media blockАдаптив на 1280 px добавил:

- **Карточка позиции** при ≤1280: «Продукт» сверху на всю ширину, ниже в одну строку «Тара + qty‑степпер». Кнопка удаления остаётся справа по вертикали по центру — как в Figma (`.frame-parent` → `.input-dropdown-parent` → `.input-dropdown-group`).
- **Способ получения + Дата отгрузки** остаются в одну строку (убрал ошибочный `input-dropdown-parent` с этого ряда — в Figma его там нет).
- Sidebar 312→280, виджеты внутри формы тянутся на всю доступную ширину через `width: auto` правила из @media (как в твоём CSS).
- Поправил `.input-dropdown-parent > *` чтобы вложенные `flex:1`‑обёртки не растягивались по высоте и принимали полную ширину при переходе в колонку.

_[tool: fork_verifier_agent]_

Готово.

