# ngx-callout

Think of `<ngx-callout>` as a coloured notice box: an icon, a title, a line of text, and anything else you put inside. Pick a type and it picks the colour.

```
┃  ⚠  Heads up                         ← heading
┃     This changes in v2               ← subheading
┃     Anything you put inside it.      ← your content (ng-content)
```

Four types: 🔵 **Info** · 🟡 **Warning** · 🔴 **Error** · 🟢 **Success**

Each one comes with a soft tinted background, a coloured bar on the left, and its own icon. Add an outline or rounded corners, swap in your brand colour, or turn the icon off.

**[Live demo and playground →](https://vishaalsharmaa.github.io/ngx-callout/)**

- 4 strongly typed callout types: `MessageState.Info`, `Warning`, `Error`, `Success`
- Icons on by default, can be turned off per callout or app-wide
- Every element has a stable `id`; the callout and icon have an `aria-label`
- Colors change through one `accent` value or individual shades
- Standalone component, signal inputs, `OnPush`, no dependencies besides Angular

## Install

```bash
npm install ngx-callout
```

Requires Angular 21 or newer.

## Usage

```ts
import { Component } from '@angular/core';
import { MessageState, NgxCallout } from 'ngx-callout';

@Component({
  selector: 'app-page',
  imports: [NgxCallout],
  template: `
    <ngx-callout
      [type]="MessageState.Warning"
      heading="Heads up"
      subheading="This changes in v2"
    >
      Any content goes here, including <a href="/docs">links</a>.
    </ngx-callout>
  `,
})
export class PageComponent {
  protected readonly MessageState = MessageState;
}
```

The `type` input also accepts the enum's string value, still type-checked: `type="warning"` compiles, `type="warn"` does not.

## Inputs

| Input        | Type                                 | Default              | Description                                                        |
| ------------ | ------------------------------------ | -------------------- | ------------------------------------------------------------------ |
| `type`       | `MessageState \| 'info' \| 'warning' \| 'error' \| 'success'` | `MessageState.Info`  | Sets colors, icon and ARIA role.                                    |
| `heading`    | `string`                             | `''`                 | Bold heading. Hidden when empty.                                   |
| `subheading` | `string`                             | `''`                 | Lighter text under the heading. Hidden when empty.                 |
| `showIcon`   | `boolean`                            | `true`               | Show the type icon.                                               |
| `outline`    | `boolean`                            | `false`              | Solid border on all four sides, in the same shade as the left border. |
| `rounded`    | `boolean`                            | `false`              | Rounds all four corners (5px).                                     |
| `id`         | `string`                             | `ngx-callout-{n}`    | Id of the callout. Inner element ids are derived from it.          |
| `ariaLabel`  | `string`                             | `'{State}: {heading}'` | Accessible name of the callout.                                  |
| `role`       | `string`                             | `alert` for errors, else `note` | Overrides the ARIA role.                               |
| `colors`     | `CalloutColors`                      | none                 | Color overrides for this callout.                                  |

## Outline and rounded corners

```html
<ngx-callout type="info" heading="Outlined and rounded" outline rounded />
```

`outline` adds a 1px border on the top, right and bottom, in the same shade as the thick left border. `rounded` rounds all four corners by 5px. Both work on their own or together, and both can be set app-wide with `provideCallout({ outline: true, rounded: true })`. Change the sizes with `--ngx-callout-outline-width` and `--ngx-callout-radius`.

## Ids and accessibility

With `id="tip"`, the callout renders:

| Element     | id               | Accessibility                                     |
| ----------- | ---------------- | ------------------------------------------------- |
| callout     | `tip`            | `role="note"` (or `alert`), `aria-label="Warning: Heads up"` |
| icon        | `tip-icon`       | `role="img"`, `aria-label="Warning"`              |
| body        | `tip-body`       |                                                   |
| heading     | `tip-heading`    |                                                   |
| sub-heading | `tip-subheading` |                                                   |
| content     | `tip-content`    |                                                   |

Plain text elements don't get an `aria-label`: ARIA doesn't allow names on generic elements, and screen readers already read their text.

Error callouts use `role="alert"`, so screen readers announce them as soon as they appear. Pass `role="note"` to opt out.

## Custom content

The default slot takes any content. Two named slots replace the built-in icon or heading:

```html
<ngx-callout [type]="MessageState.Success">
  <svg ngxCalloutIcon viewBox="0 0 24 24">…</svg>
  <span ngxCalloutHeading>Version <code>2.0</code> is out</span>
  <p>Release notes…</p>
</ngx-callout>
```

Import `NgxCalloutIcon` and `NgxCalloutHeading` alongside `NgxCallout` to use them.

## Colors

### Set just the accent

Every shade (background, border, text, icon) is derived from one accent color:

```html
<ngx-callout [type]="MessageState.Info" [colors]="{ accent: '#6d28d9' }" heading="Brand color" />
```

### Fine-tune individual shades

```ts
const colors: CalloutColors = {
  accent: '#ea580c',
  background: '#fff1e6',
  border: '#9a3412',
  text: '#431407',
  heading: '#431407',
  icon: '#c2410c',
};
```

A hand-set `background` stays the same in light and dark themes. When you set it, set `text` and `heading` as well, so they stay readable on a dark surface.

### App-wide colors

```ts
// app.config.ts
import { MessageState, provideCallout } from 'ngx-callout';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCallout({
      showIcon: true,
      outline: false,
      rounded: true,
      colors: {
        [MessageState.Info]: { accent: '#6d28d9' },
        [MessageState.Error]: { accent: '#be123c' },
      },
      labels: { [MessageState.Info]: 'Hinweis' }, // translate screen-reader names
    }),
  ],
};
```

### CSS variables

You can also theme from CSS, without TypeScript:

```css
:root {
  --ngx-callout-info-accent: #6d28d9;
  --ngx-callout-warning-accent: #f59e0b;
  --ngx-callout-error-accent: #be123c;
  --ngx-callout-success-accent: #15803d;

  --ngx-callout-radius: 8px; /* used when rounded is on */
  --ngx-callout-padding: 16px 20px;
  --ngx-callout-border-width: 4px;
}
```

| Variable                           | Default                     |
| ---------------------------------- | --------------------------- |
| `--ngx-callout-{type}-accent`      | built-in color per type     |
| `--ngx-callout-accent`             | per-type accent             |
| `--ngx-callout-bg`                 | 14% accent on the surface   |
| `--ngx-callout-border`             | accent                      |
| `--ngx-callout-text`               | 35% accent on the ink color |
| `--ngx-callout-heading`            | text color                  |
| `--ngx-callout-icon`               | 80% accent on the ink color |
| `--ngx-callout-surface`            | `#ffffff`                   |
| `--ngx-callout-ink`                | `#1b2230`                   |
| `--ngx-callout-radius`             | `5px` (when `rounded`)      |
| `--ngx-callout-outline-width`      | `1px` (when `outline`)      |
| `--ngx-callout-padding`            | `14px 18px 14px 14px`       |
| `--ngx-callout-border-width`       | `5px`                       |
| `--ngx-callout-gap`                | `12px`                      |
| `--ngx-callout-font-size`          | `0.95rem`                   |

Order of precedence, highest first: the `colors` input, `provideCallout({ colors })`, CSS variables, built-in defaults.

### Dark mode

Set your dark theme's background and text colors; every shade follows:

```css
.dark-theme {
  --ngx-callout-surface: #11151c;
  --ngx-callout-ink: #e4e8f0;
}
```

## Development

```bash
npm install
npm run build:lib    # builds dist/ngx-callout
npm run test:lib     # unit tests
npm start            # demo app at http://localhost:4200
```

## License

MIT
