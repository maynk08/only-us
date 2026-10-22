import { NavLink } from 'react-router'
import { useMessages } from '../data/context'
import { ChatIcon, HeartIcon } from './icons'

const tabs = [
  { to: '/', label: 'Us', Icon: HeartIcon, end: true },
  { to: '/chat', label: 'Chat', Icon: ChatIcon, end: false },
]

export function BottomNav() {
  const { unread } = useMessages()
  return (
    <nav aria-label="Main" className="glass glass-lg grid grid-cols-2 gap-1 rounded-[34px] p-1.5">
      {tabs.map(({ to, label, Icon, end }) => {
        const badge = to === '/chat' && unread > 0 ? unread : 0
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={badge ? `${label}, ${badge} new` : label}
            className={({ isActive }) =>
              `relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-[28px] text-[11px] no-underline transition-colors ${
                isActive
                  ? 'bg-lens font-semibold text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
                  : 'font-medium text-muted'
              }`
            }
          >
            <span className="relative">
              <Icon />
              {badge > 0 && <UnreadBadge count={badge} className="absolute -top-1.5 -right-3" />}
            </span>
            {label}
          </NavLink>
        )
      })}
    </nav>
  )
}

export function UnreadBadge({ count, className = '' }: { count: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`orb flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10.5px] leading-none font-bold ${className}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}
