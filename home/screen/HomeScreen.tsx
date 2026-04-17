import React from 'react';

import { DashboardHomeContent, DashboardShell } from '@/dashboard/components';

/**
 * Home hub — mirrors web `campus-connect-client/src/app/dashboard/page.tsx`:
 * permanent sidebar + main column with `#fafafb` background (`DashboardShell`).
 */
export function HomeScreen() {
  return (
    <DashboardShell title="Home">
      <DashboardHomeContent />
    </DashboardShell>
  );
}

export default HomeScreen;
