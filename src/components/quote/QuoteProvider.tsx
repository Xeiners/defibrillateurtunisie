import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { packs } from '@/data/pricing'
import { QuoteContext, type QuoteContextValue, type QuoteLine } from '@/store/quote-context'

const STORAGE_KEY = 'defibrillateur-tn.devis'
const MAX_QUANTITY = 50

/**
 * Sélection en cours de devis.
 *
 * Elle survit à la navigation ET au rechargement (`sessionStorage`) : le
 * visiteur qui revient sur les packs pour en comparer un autre retrouve sa
 * demande intacte. Rien n'est conservé d'une session à l'autre, une demande de
 * devis n'ayant pas de raison de traîner.
 *
 * Seuls des identifiants et une durée sont stockés ; les libellés et les prix
 * sont toujours relus dans `@/data/pricing`. Une seule source de vérité, et une
 * grille tarifaire modifiée ne laisse pas de vieux prix derrière elle.
 */
export function QuoteProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<QuoteLine[]>(readStoredLines)

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Stockage refusé (navigation privée stricte) : la sélection vit en mémoire.
    }
  }, [lines])

  const add = useCallback((packId: string, months: number) => {
    if (!packs.some((pack) => pack.id === packId)) return

    setLines((current) =>
      current.some((line) => line.packId === packId)
        ? current.map((line) => (line.packId === packId ? { ...line, months } : line))
        : [...current, { packId, months, quantity: 1 }],
    )
  }, [])

  const remove = useCallback((packId: string) => {
    setLines((current) => current.filter((line) => line.packId !== packId))
  }, [])

  const setMonths = useCallback((packId: string, months: number) => {
    setLines((current) =>
      current.map((line) => (line.packId === packId ? { ...line, months } : line)),
    )
  }, [])

  const setQuantity = useCallback((packId: string, quantity: number) => {
    const clamped = Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)))
    setLines((current) =>
      current.map((line) => (line.packId === packId ? { ...line, quantity: clamped } : line)),
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<QuoteContextValue>(() => {
    const monthlyTotal = lines.reduce((total, line) => total + monthlyOf(line), 0)

    return {
      lines,
      count: lines.length,
      deviceCount: lines.reduce((total, line) => total + line.quantity, 0),
      monthlyTotal,
      has: (packId) => lines.some((line) => line.packId === packId),
      add,
      remove,
      setMonths,
      setQuantity,
      clear,
    }
  }, [lines, add, remove, setMonths, setQuantity, clear])

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

/** Loyer d'une ligne, relu dans la grille : jamais celui qui a été stocké. */
function monthlyOf(line: QuoteLine) {
  const pack = packs.find((item) => item.id === line.packId)
  const term = pack?.terms.find((option) => option.months === line.months)
  return term ? term.monthly * line.quantity : 0
}

/**
 * Relecture du stockage, ligne par ligne.
 *
 * Tout ce qui ne correspond plus à la grille actuelle est écarté : un pack
 * retiré du catalogue, ou une durée qui n'est plus proposée, ne doit pas
 * ressortir dans un devis.
 */
function readStoredLines(): QuoteLine[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.flatMap((entry) => {
      if (typeof entry !== 'object' || entry === null) return []
      const { packId, months, quantity } = entry as Record<string, unknown>

      const pack = packs.find((item) => item.id === packId)
      if (!pack || !pack.terms.some((option) => option.months === months)) return []

      return [
        {
          packId: pack.id,
          months: months as number,
          quantity:
            typeof quantity === 'number' && Number.isFinite(quantity)
              ? Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)))
              : 1,
        },
      ]
    })
  } catch {
    return []
  }
}
