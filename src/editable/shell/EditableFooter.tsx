'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const { session, logout } = useEditableLocalAuthSession()
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const footerVars = {
    '--editable-footer-bg': '#fffdf8',
    '--editable-footer-text': '#091413',
  } as CSSProperties

  return (
    <footer style={footerVars} className="border-t border-[color:rgba(9,20,19,0.1)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[1480px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8 lg:py-24">
        <div>
          <Link href="/" className="inline-block">
            <span className="block text-[3.2rem] font-semibold leading-none tracking-[-0.08em] sm:text-[4.6rem]">{SITE_CONFIG.name.toLowerCase()}</span>
            <span className="mt-1 block text-[11px] font-medium tracking-[0.22em] text-[var(--slot4-muted-text)]">
              {globalContent.footer?.tagline || SITE_CONFIG.tagline}
            </span>
          </Link>
          <p className="mt-8 max-w-md text-base leading-9 text-[var(--slot4-muted-text)]">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">Explore</h3>
          <div className="mt-6 grid gap-3">
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-base font-medium transition hover:text-[var(--slot4-accent)]">
                {task.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">Contact</h3>
          <div className="mt-6 grid gap-3 text-base leading-8 text-[var(--slot4-muted-text)]">
            <Link href="/contact" className="transition hover:text-[var(--slot4-accent)]">Contact page</Link>
            {session ? (
              <>
                <Link href="/create" className="transition hover:text-[var(--slot4-accent)]">Publishing workspace</Link>
                <button type="button" onClick={logout} className="text-left transition hover:text-[var(--slot4-accent)]">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="transition hover:text-[var(--slot4-accent)]">Login</Link>
                <Link href="/signup" className="transition hover:text-[var(--slot4-accent)]">Create account</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-[color:rgba(9,20,19,0.1)] px-4 py-5 text-center text-xs font-medium tracking-[0.16em] text-[var(--slot4-muted-text)] sm:px-6 lg:px-8">
        Copyright {year} {SITE_CONFIG.name}. {globalContent.footer?.bottomNote}
      </div>
    </footer>
  )
}
