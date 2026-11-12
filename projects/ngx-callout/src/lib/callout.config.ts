import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { MessageState } from './message-state.enum';
import { CalloutColorMap, CalloutStateLabels } from './callout.types';

/** App-wide settings for every `<ngx-callout>`. */
export interface NgxCalloutConfig {
  /** Default for the `showIcon` input. Default: `true`. */
  showIcon: boolean;
  /** Default for the `outline` input. Default: `false`. */
  outline: boolean;
  /** Default for the `rounded` input. Default: `false`. */
  rounded: boolean;
  /** Color overrides per state, applied before any per-callout `colors` input. */
  colors: CalloutColorMap;
  /** Screen-reader names for each state. Override these to translate them. */
  labels: CalloutStateLabels;
}

export const DEFAULT_CALLOUT_LABELS: CalloutStateLabels = {
  [MessageState.Info]: 'Information',
  [MessageState.Warning]: 'Warning',
  [MessageState.Error]: 'Error',
  [MessageState.Success]: 'Success',
};

export const DEFAULT_CALLOUT_CONFIG: NgxCalloutConfig = {
  showIcon: true,
  outline: false,
  rounded: false,
  colors: {},
  labels: DEFAULT_CALLOUT_LABELS,
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
  colors?: CalloutColorMap;
  labels?: Partial<CalloutStateLabels>;
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
  const config: NgxCalloutConfig = {
    showIcon: options.showIcon ?? DEFAULT_CALLOUT_CONFIG.showIcon,
    outline: options.outline ?? DEFAULT_CALLOUT_CONFIG.outline,
    rounded: options.rounded ?? DEFAULT_CALLOUT_CONFIG.rounded,
    colors: options.colors ?? {},
    labels: { ...DEFAULT_CALLOUT_LABELS, ...options.labels },
  };
  return makeEnvironmentProviders([{ provide: NGX_CALLOUT_CONFIG, useValue: config }]);
}
