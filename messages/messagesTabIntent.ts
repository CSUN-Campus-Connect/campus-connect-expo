let pendingOpenInbox = false;

export function requestOpenMessagesInbox(): void {
  pendingOpenInbox = true;
}

export function consumeOpenMessagesInboxIntent(): boolean {
  if (!pendingOpenInbox) return false;
  pendingOpenInbox = false;
  return true;
}
