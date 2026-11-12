import { Directive } from '@angular/core';

/**
 * Marks projected content that replaces the built-in icon.
 *
 * ```html
 * <ngx-callout type="info"><svg ngxCalloutIcon>…</svg>Body</ngx-callout>
 * ```
 */
@Directive({ selector: '[ngxCalloutIcon]' })
export class NgxCalloutIcon {}

/**
 * Marks projected content that replaces the `heading` input, for headings with markup.
 *
 * ```html
 * <ngx-callout><span ngxCalloutHeading>Use <code>v2</code></span>Body</ngx-callout>
 * ```
 */
@Directive({ selector: '[ngxCalloutHeading]' })
export class NgxCalloutHeading {}
