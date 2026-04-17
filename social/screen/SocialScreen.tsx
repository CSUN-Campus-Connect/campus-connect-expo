import React from 'react';

import { SocialFeedScreen } from './SocialFeedScreen';
import { SocialThemeProvider } from '../theme/SocialThemeContext';

/**
 * Social feed — Expo port of campus-connect-client `social-feed/components/SocialFeedPage.tsx`
 * (MatadorConnect shell: nav, feed tabs, composer, posts, search / trending / quick links).
 */
export function SocialScreen() {
  return (
    <SocialThemeProvider>
      <SocialFeedScreen />
    </SocialThemeProvider>
  );
}

export default SocialScreen;
