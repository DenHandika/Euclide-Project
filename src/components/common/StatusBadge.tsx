import type { ReactNode } from 'react';
import {
  CheckCircle2,
  Clock3,
  CircleAlert,
  CircleDashed,
  Info,
  GraduationCap,
} from 'lucide-react';
import type { UserStatus } from '@/types';

export type StatusTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'info'
  | 'purple';
const tones = {
  success: {
    styles: 'bg-emerald-50 text-emerald-800 ring-emerald-600/10',
    Icon: CheckCircle2,
  },
  warning: {
    styles: 'bg-amber-50 text-amber-800 ring-amber-600/10',
    Icon: Clock3,
  },
  danger: {
    styles: 'bg-rose-50 text-rose-800 ring-rose-600/10',
    Icon: CircleAlert,
  },
  neutral: {
    styles: 'bg-slate-100 text-slate-600 ring-slate-500/10',
    Icon: CircleDashed,
  },
  info: { styles: 'bg-blue-50 text-blue-800 ring-blue-600/10', Icon: Info },
  purple: {
    styles: 'bg-violet-50 text-violet-800 ring-violet-600/10',
    Icon: GraduationCap,
  },
};

export default function StatusBadge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: StatusTone;
}) {
  const { styles, Icon } = tones[tone];
  return (
    <span
      className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold leading-5 ring-1 ring-inset ${styles}`}
    >
      <Icon
        size={14}
        strokeWidth={1.8}
        aria-hidden="true"
        className="shrink-0"
      />
      {children}
    </span>
  );
}

const accountStatuses: Record<UserStatus, { label: string; tone: StatusTone }> =
  {
    active: { label: 'Aktif', tone: 'success' },
    nonactive: { label: 'Nonaktif', tone: 'neutral' },
    suspended: { label: 'SPP tertunggak', tone: 'danger' },
    graduated: { label: 'Lulus', tone: 'purple' },
    leave: { label: 'Cuti', tone: 'warning' },
  };

export function AccountStatusBadge({ status }: { status: UserStatus }) {
  const item = accountStatuses[status] ?? accountStatuses.nonactive;
  return <StatusBadge tone={item.tone}>{item.label}</StatusBadge>;
}
