import { useEffect, useRef } from 'react'
import { ShoppingBag, Trash, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { getCachedProduct } from '@/services/productsApi'
import { actions } from '@/data/site'
import { useCart } from '@/store/cart-context'

/**
 * Panneau latéral de sélection.
 *
 * Il reste monté en permanence et se cache par transformation : on obtient
 * ainsi l'animation d'entrée ET de sortie sans machine d'états, et le réglage
 * « mouvement réduit » la rend instantanée au lieu de la supprimer.
 * `inert` retire tout le contenu du parcours clavier et de l'arbre
 * d'accessibilité quand le panneau est fermé.
 */
export function CartPanel() {
  const { items, isOpen, close, remove, clear } = useCart()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, close])

  // Les produits sont résolus depuis le cache du service, pas depuis le
  // catalogue statique : le panier fonctionnera tel quel une fois l'API
  // branchée.
  const products = items
    .map(getCachedProduct)
    .filter((product) => product !== undefined)

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        data-open={isOpen}
        className="fixed inset-0 z-50 bg-[rgb(6_18_35/0.6)] opacity-0 transition-opacity duration-400 data-[open=false]:pointer-events-none data-[open=true]:opacity-100"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ma sélection"
        inert={!isOpen}
        data-open={isOpen}
        className="fixed top-0 right-0 z-60 flex h-[100dvh] w-full max-w-[27rem] translate-x-full flex-col border-l border-[var(--border-subtle)] bg-[var(--surface-raised)] transition-transform duration-500 ease-[var(--ease-out-expo)] data-[open=true]:translate-x-0"
      >
        <header className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-6 py-5">
          <div>
            <p className="label-tech text-[var(--text-muted)]">Sélection</p>
            <h2 className="mt-2 text-[17px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
              Votre demande
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Fermer ma sélection"
            className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-field)] border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors duration-300 hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]"
          >
            <X size={16} />
          </button>
        </header>

        {products.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span
              className="grid size-12 place-items-center rounded-[var(--radius-field)] text-[var(--accent-ink)]"
              style={{ background: 'var(--accent-soft)' }}
              aria-hidden="true"
            >
              <ShoppingBag size={20} />
            </span>
            <p className="text-[15px] font-medium text-[var(--text-primary)]">
              Aucun produit sélectionné
            </p>
            <p className="max-w-[24ch] text-[14px] leading-relaxed text-[var(--text-secondary)]">
              Touchez une carte du catalogue pour l’ajouter à votre demande.
            </p>
          </div>
        ) : (
          <ul className="flex-1 list-none overflow-y-auto px-4 py-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 border-b border-[var(--border-subtle)] py-4 last:border-b-0"
              >
                <img
                  src={product.image.src}
                  alt=""
                  width={112}
                  height={112}
                  loading="lazy"
                  className="size-16 shrink-0 rounded-[var(--radius-media)] bg-[var(--surface-sunken)] object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">
                    {product.titleLines.join(' ')}
                  </p>
                  <p className="mt-1 truncate text-[13px] text-[var(--text-secondary)]">
                    {product.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  aria-label={`Retirer ${product.titleLines.join(' ')} de ma sélection`}
                  className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] text-[var(--text-muted)] transition-colors duration-300 hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]"
                >
                  <Trash size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="border-t border-[var(--border-subtle)] p-5">
          <Button
            href={actions.quote.href}
            className="w-full justify-center"
            withArrow
          >
            {actions.quote.label}
          </Button>

          {products.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full py-2.5 text-[13px] text-[var(--text-muted)] transition-colors duration-300 hover:text-[var(--text-primary)]"
            >
              Vider la sélection
            </button>
          )}
        </footer>
      </div>
    </>
  )
}
