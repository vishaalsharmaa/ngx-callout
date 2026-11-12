import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { MessageState, toMessageState } from './message-state.enum';
import { NGX_CALLOUT_CONFIG } from './callout.config';
import { CALLOUT_COLOR_VARS, CalloutColors } from './callout.types';
import { NgxCalloutHeading } from './callout-slots';

let nextId = 0;

/** Element ids inside one callout, all derived from the callout's own `id`. */
export interface CalloutElementIds {
  icon: string;
  body: string;
  heading: string;
  subheading: string;
  content: string;
}

/**
 * A docs-style callout box: a tinted background, a left accent border,
 * an icon, a bold heading, an optional sub-heading and projected content.
 *
 * ```html
 * <ngx-callout [state]="MessageState.Warning" heading="Heads up" subheading="Changes in v2">
 *   Any content, passed through ng-content.
 * </ngx-callout>
 * ```
 */
@Component({
  selector: 'ngx-callout',
  templateUrl: './callout.component.html',
  styleUrl: './callout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngx-callout',
    '[attr.id]': 'id()',
    '[attr.data-type]': 'type()',
    '[attr.role]': 'resolvedRole()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[class.ngx-callout--outline]': 'outline()',
    '[class.ngx-callout--rounded]': 'rounded()',
    '[style]': 'colorVars()',
  },
})
export class NgxCallout {
  private readonly config = inject(NGX_CALLOUT_CONFIG);

  /** Which of the four types to show (info, warning, error, success). Accepts the enum or its string value. */
  readonly type = input(MessageState.Info, { transform: toMessageState });

  /** Bold heading text. Leave empty to hide the heading. */
  readonly heading = input<string>('');

  /** Lighter text under the heading. Leave empty to hide it. */
  readonly subheading = input<string>('');

  /** Show the state icon. Defaults to `true`, or to `provideCallout({ showIcon })`. */
  readonly showIcon = input(this.config.showIcon, { transform: booleanAttribute });

  /** Draw a solid border on all four sides, in the same shade as the left accent border. */
  readonly outline = input(this.config.outline, { transform: booleanAttribute });

  /** Round all four corners (5px by default, set with `--ngx-callout-radius`). */
  readonly rounded = input(this.config.rounded, { transform: booleanAttribute });

  /**
   * Id of the callout element. Every inner element gets an id derived from it,
   * such as `{id}-heading` and `{id}-content`. Generated when not set.
   */
  readonly id = input<string>(`ngx-callout-${nextId++}`);

  /** Accessible name for the callout. Default: the state name plus the heading, e.g. "Warning: Heads up". */
  readonly ariaLabel = input<string>('');

  /** Overrides the ARIA role. Default: `alert` for errors, `note` for the other states. */
  readonly role = input<string>('');

  /** Color overrides for this callout only. Applied on top of `provideCallout({ colors })`. */
  readonly colors = input<CalloutColors | null | undefined>(undefined);

  private readonly projectedHeading = contentChild(NgxCalloutHeading);

  protected readonly stateLabel = computed(() => this.config.labels[this.type()]);

  protected readonly hasHeading = computed(() => !!this.heading() || !!this.projectedHeading());

  readonly ids = computed<CalloutElementIds>(() => {
    const id = this.id();
    return {
      icon: `${id}-icon`,
      body: `${id}-body`,
      heading: `${id}-heading`,
      subheading: `${id}-subheading`,
      content: `${id}-content`,
    };
  });

  protected readonly resolvedRole = computed(
    () => this.role() || (this.type() === MessageState.Error ? 'alert' : 'note'),
  );

  protected readonly resolvedAriaLabel = computed(() => {
    const custom = this.ariaLabel();
    if (custom) return custom;
    const heading = this.heading();
    return heading ? `${this.stateLabel()}: ${heading}` : this.stateLabel();
  });

  /** CSS custom properties for any color overrides, set on the host element. */
  protected readonly colorVars = computed<Record<string, string>>(() => {
    const merged: CalloutColors = {
      ...this.config.colors[this.type()],
      ...this.colors(),
    };
    const vars: Record<string, string> = {};
    for (const key of Object.keys(CALLOUT_COLOR_VARS) as (keyof CalloutColors)[]) {
      const value = merged[key];
      if (value) vars[CALLOUT_COLOR_VARS[key]] = value;
    }
    return vars;
  });

  protected readonly MessageState = MessageState;
}
