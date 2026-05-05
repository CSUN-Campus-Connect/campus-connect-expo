/**
 * Navigation handlers for dashboard — mirrors web sidebar targets (`DashboardSidebar` nav items).
 */

import { router } from 'expo-router';

import { requestOpenMessagesInbox } from '@/messages/messagesTabIntent';

export function openSettings(): void {
  router.push('/settings' as never);
}

export function finishSetup(): void {
  router.push('/profile' as never);
}

export function navigateToSocial(): void {
  router.push('/social' as never);
}

export function navigateToEvents(): void {
  router.push('/events' as never);
}

export function navigateToClubs(): void {
  router.push('/clubs' as never);
}

export function navigateToAcademics(): void {
  router.push('/academics' as never);
}

export function navigateToMarketplace(): void {
  router.push('/marketplace' as never);
}

export function navigateToSRC(): void {
  router.push('/student-rec' as never);
}

export function navigateToMessages(): void {
  requestOpenMessagesInbox();
  router.navigate('/messages' as never);
}

export function viewProfile(): void {
  router.push('/profile' as never);
}

export function needHelp(): void {
  router.push('/chat');
}

export function goToHome(): void {
  router.push('/home' as never);
}

export function goToMessages(): void {
  requestOpenMessagesInbox();
  router.navigate('/messages' as never);
}

export function goToMore(): void {
  router.push('/more' as never);
}

export function goToCustomizeBottomBar(): void {
  router.push('/customize-bottom-bar' as never);
}
