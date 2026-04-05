/**
 * Placeholder API / handlers for dashboard.
 * Replace with real endpoints and logic when wiring backend.
 */

import { router } from 'expo-router';

import { requestOpenMessagesInbox } from '@/messages/messagesTabIntent';

export function openSettings(): void {
  console.log('Open settings');
}

export function finishSetup(): void {
  console.log('Finish setup pressed');
}

export function navigateToSocial(): void {
  console.log('Navigate to Social');
}

export function navigateToEvents(): void {
  console.log('Navigate to Events');
}

export function navigateToClubs(): void {
  console.log('Navigate to Clubs');
}

export function navigateToAcademics(): void {
  console.log('Navigate to Academics');
}

export function navigateToMarketplace(): void {
  console.log('Navigate to Marketplace');
}

export function navigateToSRC(): void {
  console.log('Navigate to SRC');
}

export function viewProfile(): void {
  console.log('View Profile');
}

export function needHelp(): void {
  console.log('Need Help? — use ProfileBar navigation to /chat');
}

export function goToHome(): void {
  router.push('/dashboard');
}

export function goToMessages(): void {
  requestOpenMessagesInbox();
  router.navigate('/messages' as never);
}

export function goToMore(): void {
  console.log('Go to More');
}
