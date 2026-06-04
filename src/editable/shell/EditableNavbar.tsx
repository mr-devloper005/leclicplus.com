'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bookmark, LogIn, Menu, PlusCircle, Search, User, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })),
    []
  )
  const navVars = {
    '--editable-nav-bg': '#fffdf8',
    '--editable-nav-text': '#091413',
    '--editable-border': 'rgba(9, 20, 19, 0.1)',
    '--editable-container': '1480px',
  } as CSSProperties

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <div className="border-b border-[var(--editable-border)] px-4 py-2 text-center text-[10px] font-medium tracking-[0.28em] text-[var(--slot4-muted-text)] sm:px-6 lg:px-8">
        {globalContent.nav?.tagline || SITE_CONFIG.tagline}
      </div>
      <nav className="mx-auto grid min-h-[88px] w-full max-w-[var(--editable-container)] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:block" />

        <Link href="/" className="justify-self-start lg:justify-self-center">
          <span className="block text-[2.35rem] font-semibold leading-none tracking-[-0.08em] sm:text-[3.35rem]">
            {SITE_CONFIG.name.toLowerCase()}
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Link href="/search" aria-label="Search" className="rounded-full p-2 transition hover:bg-black/5">
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <Link href="/create" aria-label="Create" className="rounded-full p-2 transition hover:bg-black/5">
              <PlusCircle className="h-4 w-4" />
            </Link>
          ) : (
            <Link href="/login" aria-label="Login" className="rounded-full p-2 transition hover:bg-black/5">
              <User className="h-4 w-4" />
            </Link>
          )}
          <Link href="/sbm" aria-label="Bookmarks" className="rounded-full p-2 transition hover:bg-black/5">
            <Bookmark className="h-4 w-4" />
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" className="rounded-full p-2 transition hover:bg-black/5">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link href="/search" aria-label="Search" className="rounded-full p-2 transition hover:bg-black/5">
            <Search className="h-4 w-4" />
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" className="rounded-full border border-[var(--editable-border)] p-2">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-5 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <form action="/search" className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  name="q"
                  type="search"
                  placeholder="Search the collection"
                  className="h-12 border border-[var(--editable-border)] bg-transparent px-4 text-sm font-medium outline-none"
                />
                <button className="h-12 border border-[var(--slot4-page-text)] px-5 text-sm font-semibold transition hover:bg-[var(--slot4-page-text)] hover:text-white">
                  Search
                </button>
              </form>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {[{ label: 'Home', href: '/' }, ...navItems, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`border px-4 py-3 text-sm font-semibold transition ${active ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-white' : 'border-[var(--editable-border)] hover:border-[var(--slot4-accent-fill)] hover:text-[var(--slot4-accent)]'}`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="border border-[var(--editable-border)] bg-[var(--slot4-cream)] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">Member access</p>
              <div className="mt-4 grid gap-3">
                {session ? (
                  <>
                    <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">Signed in as {session.name}. Continue browsing or open the publishing area.</p>
                    <Link href="/create" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center border border-[var(--slot4-page-text)] text-sm font-semibold transition hover:bg-[var(--slot4-page-text)] hover:text-white">
                      <PlusCircle className="mr-2 h-4 w-4" /> Create
                    </Link>
                    <button type="button" onClick={logout} className="inline-flex h-12 items-center justify-center border border-[var(--editable-border)] text-sm font-semibold transition hover:border-[var(--slot4-accent-fill)] hover:text-[var(--slot4-accent)]">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">Save your place, publish clean submissions, and move through the site with a personal account.</p>
                    <Link href="/login" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center border border-[var(--slot4-page-text)] text-sm font-semibold transition hover:bg-[var(--slot4-page-text)] hover:text-white">
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </Link>
                    <Link href="/signup" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center border border-[var(--editable-border)] text-sm font-semibold transition hover:border-[var(--slot4-accent-fill)] hover:text-[var(--slot4-accent)]">
                      <UserPlus className="mr-2 h-4 w-4" /> Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
