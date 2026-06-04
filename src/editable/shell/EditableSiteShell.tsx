import type { ReactNode } from 'react'
import { EditableNavbar } from '@/editable/shell/EditableNavbar'
import { EditableFooter } from '@/editable/shell/EditableFooter'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function EditableSiteShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <>
      <EditableNavbar />
      <div className={`${dc.shell.page} flex min-h-[calc(100vh-90px)] flex-col ${className}`}>
        <div className="min-h-0 flex-1">{children}</div>
        <EditableFooter />
      </div>
    </>
  )
}
