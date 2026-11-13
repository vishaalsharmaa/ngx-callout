import { MessageState } from './message-state.enum';

/**
 * Color overrides for a callout. Every field is optional and accepts any CSS color.
 *
 * Usually setting `accent` is enough: the background, border, text and icon
 * shades are all derived from it. Set the other fields only to fine-tune a shade.
 */
export interface CalloutColors {
  /** Base color. All other shades are derived from it unless set below. */
  accent?: string;
  /** Box background. Default: 14% accent mixed into the surface color. */
  background?: string;
  /** Left border. Default: the accent. */
  border?: string;
  /** Body text. Default: 35% accent mixed into the ink color. */
  text?: string;
  /** Heading text. Default: same as `text`. */
  heading?: string;
  /** Icon color. Default: 80% accent mixed into the ink color. */
  icon?: string;
}

/** Color overrides per state, e.g. `{ [MessageState.Info]: { accent: '#6d28d9' } }`. */
export type CalloutColorMap = Partial<Record<MessageState, CalloutColors>>;

/** Screen-reader names for each state, used for the icon and the default `aria-label`. */
export type CalloutStateLabels = Record<MessageState, string>;

/** Screen-reader names for the expand/collapse button. */
export interface CalloutAccordionLabels {
  /** Read when the content is collapsed and the button will open it. */
  expand: string;
  /** Read when the content is open and the button will close it. */
  collapse: string;
}

/** Maps each `CalloutColors` field to the CSS custom property it sets. */
export const CALLOUT_COLOR_VARS: Readonly<Record<keyof CalloutColors, string>> = {
  accent: '--ngx-callout-accent',
  background: '--ngx-callout-bg',
  border: '--ngx-callout-border',
  text: '--ngx-callout-text',
  heading: '--ngx-callout-heading',
  icon: '--ngx-callout-icon',
};
