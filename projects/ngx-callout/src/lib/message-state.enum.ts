/**
 * The type of a callout: its color, icon and meaning.
 *
 * Each type has its own default color, icon and ARIA role.
 */
export enum MessageState {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Success = 'success',
}

/**
 * What the `type` input accepts: the enum, or its string value.
 *
 * `MessageState.Warning` and `'warning'` both type-check; `'warn'` does not.
 */
export type MessageStateInput = MessageState | `${MessageState}`;

const VALID_STATES = new Set<string>(Object.values(MessageState));

/** Converts the `type` input to the enum, falling back to `Info` for unknown values. */
export function toMessageState(value: MessageStateInput | null | undefined): MessageState {
  if (value && VALID_STATES.has(value)) {
    return value as MessageState;
  }
  if (value && typeof ngDevMode !== 'undefined' && ngDevMode) {
    console.warn(
      `[ngx-callout] Unknown type "${value}". Expected one of: ${[...VALID_STATES].join(', ')}. Using "info".`,
    );
  }
  return MessageState.Info;
}

declare const ngDevMode: boolean | undefined;
