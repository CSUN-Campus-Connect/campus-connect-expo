/**
 * Bottom tab bar: Home, Messages, up to two optional shortcuts, More (max 5 items).
 */

export type BottomBarOptionalId = 'social' | 'events' | 'clubs' | 'academics' | 'src';

export type BottomBarTabId =
  | 'home'
  | 'messages'
  | 'more'
  | BottomBarOptionalId;

const OPTIONAL_IDS = new Set<BottomBarOptionalId>([
  'social',
  'events',
  'clubs',
  'academics',
  'src',
]);

export function isBottomBarOptionalId(value: string): value is BottomBarOptionalId {
  return OPTIONAL_IDS.has(value as BottomBarOptionalId);
}

/** Map current route to which bottom tab should appear selected. */
export function bottomBarTabFromPathname(pathname: string): BottomBarTabId {
  const p = pathname || '/';
  if (p === '/home' || p === '/') return 'home';
  if (p.startsWith('/messages')) return 'messages';
  if (
    p.startsWith('/more') ||
    p.startsWith('/settings') ||
    p.startsWith('/customize-bottom-bar') ||
    p.startsWith('/profile') ||
    p.startsWith('/chat')
  ) {
    return 'more';
  }
  if (p.startsWith('/social')) return 'social';
  if (p.startsWith('/events')) return 'events';
  if (p.startsWith('/clubs')) return 'clubs';
  if (p.startsWith('/academics')) return 'academics';
  if (p.startsWith('/student-rec')) return 'src';
  return 'home';
}
