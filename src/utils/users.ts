import { UserRole as EnUserRole } from '~/kysely/enums'
import invert from 'lodash.invert'

export const userRoleMapping = {
  أدمن: EnUserRole.ADMIN,
  طالب: EnUserRole.STUDENT,
  مصحح: EnUserRole.CORRECTOR,
}

type ArUserRole = keyof typeof userRoleMapping

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const arUserRoleToEn = (arUserRole: string): EnUserRole | string =>
  userRoleMapping[arUserRole as ArUserRole] ?? arUserRole
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const enUserRoleToAr = (enUserRole: string): ArUserRole | string => {
  const inverted = invert(userRoleMapping)
  return inverted[enUserRole as keyof typeof inverted] ?? enUserRole
}

export const getFirstName = (name?: string | null, fallback = 'مستخدم') => {
  return name?.split(' ')[0] ?? fallback
}
