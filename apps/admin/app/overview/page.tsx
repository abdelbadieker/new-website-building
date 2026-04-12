import { redirect } from 'next/navigation';

export default function OverviewRedirect() {
  // Always redirect to dashboard or login
  redirect('/dashboard');
}
