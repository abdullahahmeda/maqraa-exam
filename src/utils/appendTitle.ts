import { ResolvingMetadata } from 'next'

export async function appendTitle(str: string, parent: ResolvingMetadata) {
  const parentTitle = (await parent).title ?? ''
  return `${str} | ${parentTitle}`
}
