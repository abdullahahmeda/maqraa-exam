export function toArray<T>(item: T) {
  if (Array.isArray(item)) return item
  return [item]
}
