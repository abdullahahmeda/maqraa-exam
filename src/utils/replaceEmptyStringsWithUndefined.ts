import mapValues from 'lodash.mapvalues'

// Note: not working with arrays
export function coerceEmptyStringsToUndefined(o: unknown): unknown {
  if (typeof o === 'object' && o !== null) {
    if (Array.isArray(o)) {
      // return something here if you want it to work with arrays
    } else {
      return mapValues(o, coerceEmptyStringsToUndefined)
    }
  }
  return o === '' ? undefined : o
}
