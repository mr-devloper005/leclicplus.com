import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-current/10', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1480px] px-4 py-12 sm:px-6 lg:px-8', className)} aria-live="polite" aria-busy="true">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-current/50">{label}</p>
      <PulseBlock className="mt-5 h-12 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="border border-current/10 p-5">
            <PulseBlock className="h-52 w-full" />
            <PulseBlock className="mt-5 h-5 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-current/10 p-4">
          <PulseBlock className="h-44 w-full" />
          <PulseBlock className="mt-4 h-5 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[1480px] gap-8 px-4 py-12 lg:grid-cols-[1fr_320px] lg:px-8', className)} aria-live="polite" aria-busy="true">
      <div className="border border-current/10 p-6">
        <PulseBlock className="h-96 w-full" />
        <PulseBlock className="mt-6 h-12 w-4/5" />
        <PulseBlock className="mt-5 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
      </div>
      <div className="border border-current/10 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-current/50">{label}</p>
        <PulseBlock className="mt-5 h-32 w-full" />
      </div>
    </div>
  )
}
