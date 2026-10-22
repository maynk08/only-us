interface ComingSoonProps {
  title: string
  note: string
}

export function ComingSoon({ title, note }: ComingSoonProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <h1 className="font-serif text-4xl font-light">{title}</h1>
      <p className="max-w-[260px] text-sm text-muted">{note}</p>
    </div>
  )
}
