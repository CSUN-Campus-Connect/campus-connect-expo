/**
 * Map Next.js public paths to a stable remote placeholder for Expo bundles.
 * Trainer photos in ServicesData already use https URLs and pass through unchanged.
 */
export function resolveSrcImage(path: string): string {
  if (path.startsWith('http')) return path;
  const key = path.replace(/\W/g, '').slice(0, 40);
  return `https://picsum.photos/seed/${key}/800/520`;
}
