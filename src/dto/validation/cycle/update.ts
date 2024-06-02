import { type UpdateCycleBackendSchema } from '~/validation/backend/mutations/cycle/update'
import { type UpdateCycleFrontendSchema } from '~/validation/frontend/cycle/update'

export function updateCycleFrontendDataToBackend(
  data: UpdateCycleFrontendSchema,
): UpdateCycleBackendSchema {
  return {
    id: data.id,
    name: data.name,
    curricula: data.curricula.map(({ value }) => value),
  }
}
