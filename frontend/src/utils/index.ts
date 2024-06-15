export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export const capitalizeString = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
