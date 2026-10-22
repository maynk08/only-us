import { NavLink } from 'react-router'
import { BookIcon, ChatIcon, HeartIcon, SmileIcon } from './icons'

const tabs = [
  { to: '/', label: 'Us', Icon: HeartIcon, end: true },
  { to: '/chat', label: 'Chat', Icon: ChatIcon, end: false },
  { to: '/story', label: 'Story', Icon: BookIcon, end: false },
  { to: '/stickers', label: 'Stickers', Icon: SmileIcon, end: false },
]

export function BottomNav() {
  return (
    <nav aria-label="Main" className="glass glass-lg grid grid-cols-4 gap-1 rounded-[34px] p-1.5">
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex h-14 flex-col items-center justify-center gap-0.5 rounded-[28px] text-[11px] no-underline transition-colors ${
              isActive
                ? 'bg-lens font-semibold text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
                : 'font-medium text-muted'
            }`
          }
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
