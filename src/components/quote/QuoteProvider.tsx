import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { QuoteContext, type QuoteContextValue } from '@/store/quote-context'
import { actions } from '@/data/site'
import { QuoteModal } from './QuoteModal'

/**
 * Ouvre la demande de devis en fenêtre, depuis n'importe quel appel de la page.
 *
 * L'interception est faite ICI, sur un seul écouteur posé au document : tout
 * lien qui vise l'ancre du devis ouvre la fenêtre. Les quinze boutons de la
 * page n'ont donc rien à savoir de cette fenêtre, et un clic milieu ou un
 * « ouvrir dans un nouvel onglet » continue de mener au pied de page.
 */
export function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // On laisse passer les clics « ouvrir ailleurs ».
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as Element | null
      const link = target?.closest?.(`a[href="${actions.quote.href}"]`)
      if (!link) return

      event.preventDefault()
      setIsOpen(true)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const value = useMemo<QuoteContextValue>(() => ({ isOpen, open, close }), [isOpen, open, close])

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteModal isOpen={isOpen} onClose={close} />
    </QuoteContext.Provider>
  )
}
