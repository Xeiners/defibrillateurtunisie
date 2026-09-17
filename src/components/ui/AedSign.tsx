import { cn } from '@/lib/cn'

/**
 * Panneau « Ce site est équipé d'un défibrillateur », en autocollant.
 *
 * Redessiné plutôt que repris d'une image : les panneaux du commerce citent le
 * décret français n° 2007-705, sans valeur en Tunisie. Le pictogramme suit le
 * symbole international du DAE (coeur, éclair, croix).
 */
export function AedSign({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Panneau : ce site est équipé d’un défibrillateur"
      className={cn(
        'flex items-stretch gap-1.5 rounded-lg bg-white p-1.5 shadow-[0_14px_30px_-12px_rgb(7_18_36/0.45)]',
        className,
      )}
    >
      <div className="grid aspect-square w-16 shrink-0 place-items-center rounded-md bg-brand-600 p-2 sm:w-18">
        <svg viewBox="0 0 64 64" className="size-full" aria-hidden="true">
          <path
            d="M28 60C10 47 3 37 3 26c0-8 6-14 13.5-14 5 0 9 2.6 11.5 7 2.5-4.4 6.5-7 11.5-7C47 12 53 18 53 26c0 11-7 21-25 34Z"
            fill="#fff"
          />
          <path d="M32 19 20 38h8l-4 15 13-21h-8l3-13Z" className="fill-brand-600" />
          <path d="M53 0h5v7h6v5h-6v7h-5v-7h-6V7h6Z" fill="#fff" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col justify-center rounded-md bg-brand-600 px-3 py-2 text-center text-white">
        <p className="text-[13px] leading-[1.15] font-extrabold uppercase sm:text-[15px]">
          Ce site est équipé
          <br />
          d’un défibrillateur
        </p>
      </div>
    </div>
  )
}
