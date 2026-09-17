type ClassValue = string | false | null | undefined

/** Concaténation de classes, sans dépendance. */
export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(' ')
}
