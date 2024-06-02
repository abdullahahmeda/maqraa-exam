import { type CreateCycleBackendSchema } from '~/validation/backend/mutations/cycle/create'
import { type CreateCycleFrontendSchema } from '~/validation/frontend/cycle/create'

export function createCycleFrontendDataToBackend(
  data: CreateCycleFrontendSchema,
): CreateCycleBackendSchema {
  return {
    name: data.name,
    curricula: data.curricula.map(({ value }) => value),
  }
}
