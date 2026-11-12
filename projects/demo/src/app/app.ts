import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import libPackage from '../../../ngx-callout/package.json';
import {
  CalloutColors,
  MessageState,
  NgxCallout,
  NgxCalloutHeading,
  NgxCalloutIcon,
} from 'ngx-callout';

/** The library's built-in accent for each state, used as the color picker's starting value. */
const DEFAULT_ACCENTS: Record<MessageState, string> = {
  [MessageState.Info]: '#1689ad',
  [MessageState.Warning]: '#d4a017',
  [MessageState.Error]: '#d43c3c',
  [MessageState.Success]: '#2f9e44',
};

const ENUM_KEYS = Object.fromEntries(
  Object.entries(MessageState).map(([key, value]) => [value, key]),
) as Record<MessageState, string>;

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgxCallout, NgxCalloutHeading, NgxCalloutIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly MessageState = MessageState;
  /** Library version, read from projects/ngx-callout/package.json. */
  protected readonly version = libPackage.version;
  protected readonly stateOptions = Object.values(MessageState).map((value) => ({
    value,
    label: `MessageState.${ENUM_KEYS[value]}`,
  }));

  // Form fields
  protected readonly state = signal<MessageState>(MessageState.Warning);
  protected readonly heading = signal('If the SRI hashes differ, don’t use that CDN.');
  protected readonly subheading = signal('A changed hash means someone else modified the file.');
  protected readonly content = signal('Check the hash on the official download page before you add the file.');
  protected readonly showIcon = signal(true);
  protected readonly outline = signal(false);
  protected readonly rounded = signal(false);
  protected readonly customColor = signal(false);
  protected readonly accent = signal(DEFAULT_ACCENTS[MessageState.Warning]);
  protected readonly calloutId = signal('my-callout');
  protected readonly ariaLabel = signal('');
  protected readonly dark = signal(false);

  protected readonly colors = computed<CalloutColors | undefined>(() =>
    this.customColor() ? { accent: this.accent() } : undefined,
  );

  protected readonly copied = signal(false);

  /** The Angular template for the current form values. */
  protected readonly code = computed(() => {
    const attr = (v: string) => v.replace(/"/g, '&quot;');
    const lines = [`[type]="MessageState.${ENUM_KEYS[this.state()]}"`];
    if (this.heading()) lines.push(`heading="${attr(this.heading())}"`);
    if (this.subheading()) lines.push(`subheading="${attr(this.subheading())}"`);
    if (!this.showIcon()) lines.push(`[showIcon]="false"`);
    if (this.outline()) lines.push('outline');
    if (this.rounded()) lines.push('rounded');
    if (this.customColor()) lines.push(`[colors]="{ accent: '${this.accent()}' }"`);
    if (this.calloutId()) lines.push(`id="${attr(this.calloutId())}"`);
    if (this.ariaLabel()) lines.push(`ariaLabel="${attr(this.ariaLabel())}"`);

    const open = `<ngx-callout\n  ${lines.join('\n  ')}`;
    const body = this.content().trim();
    return body ? `${open}>\n  ${body}\n</ngx-callout>` : `${open} />`;
  });

  protected onStateChange(state: MessageState): void {
    this.state.set(state);
    // Keep the picker on the new state's color until the user picks their own.
    if (!this.customColor()) this.accent.set(DEFAULT_ACCENTS[state]);
  }

  protected reset(): void {
    this.state.set(MessageState.Warning);
    this.heading.set('If the SRI hashes differ, don’t use that CDN.');
    this.subheading.set('A changed hash means someone else modified the file.');
    this.content.set('Check the hash on the official download page before you add the file.');
    this.showIcon.set(true);
    this.outline.set(false);
    this.rounded.set(false);
    this.customColor.set(false);
    this.accent.set(DEFAULT_ACCENTS[MessageState.Warning]);
    this.calloutId.set('my-callout');
    this.ariaLabel.set('');
  }

  protected async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      this.copied.set(false);
    }
  }

  protected readonly gallery = [
    { state: MessageState.Info, heading: 'Try it yourself!', subheading: 'Working demos for Angular 21' },
    { state: MessageState.Warning, heading: 'Heads up', subheading: 'This API changes in v2' },
    { state: MessageState.Error, heading: 'Payment failed', subheading: 'Your card was declined' },
    { state: MessageState.Success, heading: 'You’re all set', subheading: 'ngx-callout is installed' },
  ];
}
