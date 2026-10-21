import { useState, type FormEvent } from 'react'
import { MicIcon, PlusIcon, SendIcon, SmileIcon } from '../../components/icons'

interface ComposerProps {
  onSend: (text: string) => void
}

export function Composer({ onSend }: ComposerProps) {
  const [text, setText] = useState('')
  const hasText = text.trim().length > 0

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!hasText) return
    onSend(text.trim())
    setText('')
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 px-3.5 pt-1 pb-[calc(16px+env(safe-area-inset-bottom))]">
      <button
        type="button"
        aria-label="Add photo or sticker"
        className="glass flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-text"
      >
        <PlusIcon />
      </button>
      <div className="glass flex h-[52px] min-w-0 flex-1 items-center rounded-full pr-1.5 pl-[18px]">
        <label className="flex min-w-0 flex-1">
          <span className="sr-only">Message</span>
          <input
            type="text"
            dir="auto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message"
            enterKeyHint="send"
            className="h-11 w-full min-w-0 border-none bg-transparent text-[15px] text-text outline-none placeholder:text-muted"
          />
        </label>
        <button
          type="button"
          aria-label="Stickers and emoji"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted"
        >
          <SmileIcon />
        </button>
      </div>
      <button
        type={hasText ? 'submit' : 'button'}
        aria-label={hasText ? 'Send message' : 'Record voice note'}
        className="orb flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"
      >
        {hasText ? <SendIcon size={21} /> : <MicIcon size={21} />}
      </button>
    </form>
  )
}
