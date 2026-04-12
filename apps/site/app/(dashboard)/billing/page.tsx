import { ComingSoonModule } from '@/components/ComingSoonModule';
import { CreditCard } from 'lucide-react';

export default function Billing() {
  return <ComingSoonModule title="Billing" description="Manage your subscription, invoices, and payment methods. Transparent pricing with no hidden fees." icon={CreditCard} />;
}
