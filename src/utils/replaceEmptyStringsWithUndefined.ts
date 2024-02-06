import mapValues from 'lodash.mapvalues'

export function replaceEmptyStringsWithUndefined(o: unknown): any {
  if (typeof o === 'object' && !Array.isArray(o) && o !== null) {
    return mapValues(o, replaceEmptyStringsWithUndefined)
  }
  return o === '' ? undefined : o
}
