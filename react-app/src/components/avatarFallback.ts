export function hasImagePath(path?: string | null): path is string {
  return Boolean(path?.trim())
}

export function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim().charAt(0).toUpperCase() ?? ''
  const last = lastName?.trim().charAt(0).toUpperCase() ?? ''
  const initials = `${first}${last}`.trim()

  return initials || '?'
}
