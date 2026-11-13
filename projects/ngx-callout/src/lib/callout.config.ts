import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { MessageState } from './message-state.enum';
import { CalloutAccordionLabels, CalloutColorMap, CalloutStateLabels } from './callout.types';

/** App-wide settings for every `<ngx-callout>`. */
export interface NgxCalloutConfig {
  /** Default for the `showIcon` input. Default: `true`. */
  showIcon: boolean;
  /** Default for the `outline` input. Default: `false`. */
  outline: boolean;
  /** Default for the `rounded` input. Default: `false`. */
  rounded: boolean;
  /** Default for the `fullWidth` input. Default: `true`. */
  fullWidth: boolean;
  /** Default for the `accordionVisible` input. Default: `false`. */
  accordionVisible: boolean;
  /** Default for the `defaultOpen` input. Default: `false`. */
  defaultOpen: boolean;
  /** Color overrides per state, applied before any per-callout `colors` input. */
  colors: CalloutColorMap;
  /** Screen-reader names for each state. Override these to translate them. */
  labels: CalloutStateLabels;
  /** Screen-reader names for the expand/collapse button. Override these to translate them. */
  accordionLabels: CalloutAccordionLabels;
}

export const DEFAULT_CALLOUT_LABELS: CalloutStateLabels = {
  [MessageState.Info]: 'Information',
  [MessageState.Warning]: 'Warning',
  [MessageState.Error]: 'Error',
  [MessageState.Success]: 'Success',
};

export const DEFAULT_ACCORDION_LABELS: CalloutAccordionLabels = {
  expand: 'Show details',
  collapse: 'Hide details',
};

export const DEFAULT_CALLOUT_CONFIG: NgxCalloutConfig = {
  showIcon: true,
  outline: false,
  rounded: false,
  fullWidth: true,
  accordionVisible: false,
  defaultOpen: false,
  colors: {},
  labels: DEFAULT_CALLOUT_LABELS,
  accordionLabels: DEFAULT_ACCORDION_LABELS,
};

export const NGX_CALLOUT_CONFIG = new InjectionToken<NgxCalloutConfig>('NGX_CALLOUT_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_CALLOUT_CONFIG,
});

/** Settings accepted by `provideCallout()`. Everything is optional. */
export interface NgxCalloutOptions {
  showIcon?: boolean;
  outline?: boolean;
  rounded?: boolean;
  fullWidth?: boolean;
  accordionVisible?: boolean;
  defaultOpen?: boolean;
  colors?: CalloutColorMap;
  labels?: Partial<CalloutStateLabels>;
  accordionLabels?: Partial<CalloutAccordionLabels>;
}

/**
 * Sets app-wide defaults for callouts. Optional: callouts work without it.
 *
 * ```ts
 * providers: [
 *   provideCallout({
 *     showIcon: true,
 *     colors: { [MessageState.Info]: { accent: '#6d28d9' } },
 *   }),
 * ]
 * ```
 */
export function provideCallout(options: NgxCalloutOptions = {}): EnvironmentProviders {
  const d = DEFAULT_CALLOUT_CONFIG;
  const config: NgxCalloutConfig = {
    showIcon: options.showIcon ?? d.showIcon,
    outline: options.outline ?? d.outline,
    rounded: options.rounded ?? d.rounded,
    fullWidth: options.fullWidth ?? d.fullWidth,
    accordionVisible: options.accordionVisible ?? d.accordionVisible,
    defaultOpen: options.defaultOpen ?? d.defaultOpen,
    colors: options.colors ?? {},
    labels: { ...DEFAULT_CALLOUT_LABELS, ...options.labels },
    accordionLabels: { ...DEFAULT_ACCORDION_LABELS, ...options.accordionLabels },
  };
  return makeEnvironmentProviders([{ provide: NGX_CALLOUT_CONFIG, useValue: config }]);
}
