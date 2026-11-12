import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxCallout } from './callout.component';
import { NgxCalloutHeading, NgxCalloutIcon } from './callout-slots';
import { MessageState, MessageStateInput } from './message-state.enum';
import { provideCallout } from './callout.config';
import { CalloutColors } from './callout.types';

@Component({
  imports: [NgxCallout],
  template: `
    <ngx-callout
      [type]="state()"
      [heading]="heading()"
      [subheading]="subheading()"
      [showIcon]="showIcon()"
      [outline]="outline()"
      [rounded]="rounded()"
      [ariaLabel]="ariaLabel()"
      [colors]="colors()"
      id="tip"
    >
      Body <a href="#">link</a>
    </ngx-callout>
  `,
})
class HostComponent {
  state = signal<MessageStateInput>(MessageState.Info);
  heading = signal('Heads up');
  subheading = signal('');
  showIcon = signal(true);
  outline = signal(false);
  rounded = signal(false);
  ariaLabel = signal('');
  colors = signal<CalloutColors | undefined>(undefined);
}

@Component({
  imports: [NgxCallout],
  template: `<ngx-callout>Default</ngx-callout>`,
})
class BareHostComponent {}

@Component({
  imports: [NgxCallout, NgxCalloutIcon, NgxCalloutHeading],
  template: `
    <ngx-callout type="success">
      <svg ngxCalloutIcon class="my-icon"></svg>
      <span ngxCalloutHeading>Use <code>v2</code></span>
      Body
    </ngx-callout>
  `,
})
class SlotsHostComponent {}

async function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp);
  await fixture.whenStable();
  const el = fixture.nativeElement.querySelector('ngx-callout') as HTMLElement;
  return { fixture, el };
}

describe('NgxCallout', () => {
  it('defaults to info with an icon, a generated id and role="note"', async () => {
    const { el } = await render(BareHostComponent);
    expect(el.getAttribute('data-type')).toBe('info');
    expect(el.getAttribute('role')).toBe('note');
    expect(el.id).toMatch(/^ngx-callout-\d+$/);
    expect(el.getAttribute('aria-label')).toBe('Information');
    expect(el.querySelector('.ngx-callout__icon svg')).toBeTruthy();
    expect(el.querySelector('.ngx-callout__heading')).toBeNull();
  });

  it('derives every inner element id from the callout id', async () => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.subheading.set('Sub');
    await fixture.whenStable();
    expect(el.id).toBe('tip');
    for (const part of ['icon', 'body', 'heading', 'subheading', 'content']) {
      expect(el.querySelector(`#tip-${part}`), part).toBeTruthy();
    }
  });

  it.each([
    [MessageState.Info, 'note', 'Information'],
    [MessageState.Warning, 'note', 'Warning'],
    [MessageState.Error, 'alert', 'Error'],
    [MessageState.Success, 'note', 'Success'],
  ])('type %s sets role %s and icon label %s', async (state, role, label) => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.state.set(state);
    await fixture.whenStable();
    expect(el.getAttribute('data-type')).toBe(state);
    expect(el.getAttribute('role')).toBe(role);
    expect(el.querySelector('#tip-icon')?.getAttribute('aria-label')).toBe(label);
    expect(el.getAttribute('aria-label')).toBe(`${label}: Heads up`);
  });

  it('accepts the string value of the enum', async () => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.state.set('warning');
    await fixture.whenStable();
    expect(el.getAttribute('data-type')).toBe('warning');
  });

  it('hides the icon when showIcon is false', async () => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.showIcon.set(false);
    await fixture.whenStable();
    expect(el.querySelector('.ngx-callout__icon')).toBeNull();
  });

  it('is not outlined or rounded by default', async () => {
    const { el } = await render(BareHostComponent);
    expect(el.classList.contains('ngx-callout--outline')).toBe(false);
    expect(el.classList.contains('ngx-callout--rounded')).toBe(false);
  });

  it('adds outline and rounded classes when enabled', async () => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.outline.set(true);
    fixture.componentInstance.rounded.set(true);
    await fixture.whenStable();
    expect(el.classList.contains('ngx-callout--outline')).toBe(true);
    expect(el.classList.contains('ngx-callout--rounded')).toBe(true);
  });

  it('uses a custom aria-label when given', async () => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.ariaLabel.set('Security notice');
    await fixture.whenStable();
    expect(el.getAttribute('aria-label')).toBe('Security notice');
  });

  it('renders heading, subheading and projected content', async () => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.subheading.set('Changes in v2');
    await fixture.whenStable();
    expect(el.querySelector('#tip-heading')?.textContent?.trim()).toBe('Heads up');
    expect(el.querySelector('#tip-subheading')?.textContent?.trim()).toBe('Changes in v2');
    expect(el.querySelector('#tip-content a')).toBeTruthy();
  });

  it('sets CSS variables from the colors input', async () => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.colors.set({ accent: 'rebeccapurple', border: 'black' });
    await fixture.whenStable();
    expect(el.style.getPropertyValue('--ngx-callout-accent')).toBe('rebeccapurple');
    expect(el.style.getPropertyValue('--ngx-callout-border')).toBe('black');
    expect(el.style.getPropertyValue('--ngx-callout-bg')).toBe('');
  });

  it('projects a custom icon and heading', async () => {
    const { el } = await render(SlotsHostComponent);
    expect(el.querySelector('.ngx-callout__icon .my-icon')).toBeTruthy();
    expect(el.querySelector('.ngx-callout__icon path')).toBeNull();
    expect(el.querySelector('.ngx-callout__heading code')?.textContent).toBe('v2');
  });
});

describe('provideCallout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideCallout({
          showIcon: false,
          outline: true,
          rounded: true,
          colors: { [MessageState.Info]: { accent: 'teal' } },
          labels: { [MessageState.Info]: 'Info' },
        }),
      ],
    });
  });

  it('applies app-wide defaults', async () => {
    const { el } = await render(BareHostComponent);
    expect(el.querySelector('.ngx-callout__icon')).toBeNull();
    expect(el.classList.contains('ngx-callout--outline')).toBe(true);
    expect(el.classList.contains('ngx-callout--rounded')).toBe(true);
    expect(el.style.getPropertyValue('--ngx-callout-accent')).toBe('teal');
    expect(el.getAttribute('aria-label')).toBe('Info');
  });

  it('lets the colors input win over the global colors', async () => {
    const { fixture, el } = await render(HostComponent);
    fixture.componentInstance.colors.set({ accent: 'navy' });
    await fixture.whenStable();
    expect(el.style.getPropertyValue('--ngx-callout-accent')).toBe('navy');
  });
});
