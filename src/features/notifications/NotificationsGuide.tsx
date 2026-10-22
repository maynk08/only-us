import { useNavigate } from 'react-router'
import { BackIcon } from '../../components/icons'

const guides = [
  {
    phone: 'Motorola',
    steps: [
      'Long-press the only us icon → App info → Notifications → allow all.',
      'Settings → Apps → Chrome → App battery usage → Unrestricted.',
    ],
  },
  {
    phone: 'Infinix (XOS)',
    steps: [
      'Settings → Apps → Chrome → Battery → No restrictions (or "Allow background activity").',
      'Open Phone Master → App launch / Auto-start → allow Chrome and only us.',
      'Open recent apps, pull down on the only us card (or tap the lock icon) to lock it.',
      'Long-press the only us icon → App info → Notifications → allow all.',
    ],
  },
]

/** Phone-specific settings so the battery saver doesn't swallow notifications. */
export function NotificationsGuide() {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-[18px] pt-[calc(16px+env(safe-area-inset-top))] pb-8">
      <header className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="glass flex h-12 w-12 items-center justify-center rounded-full text-text"
        >
          <BackIcon />
        </button>
        <h1 className="font-serif text-2xl">Notifications not arriving?</h1>
      </header>
      <p className="text-sm text-muted">
        Some phones stop apps in the background to save battery, which delays or blocks notifications. These settings
        fix it. Menu names can differ slightly between phone updates.
      </p>
      {guides.map(({ phone, steps }) => (
        <section key={phone} className="glass-flat flex flex-col gap-2 rounded-[24px] p-4">
          <h2 className="font-serif text-lg">{phone}</h2>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
