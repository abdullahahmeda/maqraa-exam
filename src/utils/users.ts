import { UserRole as EnUserRole } from '../constants'
import invert from 'lodash.invert'

const userRoleMapping = {
  أدمن: EnUserRole.ADMIN,
  طالب: EnUserRole.STUDENT
}

type ArUserRole = keyof typeof userRoleMapping

export const arUserRoleToEn = (arUserRole: string): EnUserRole | string =>
  userRoleMapping[arUserRole as ArUserRole] ?? arUserRole
export const enUserRoleToAr = (enUserRole: string): ArUserRole | string => {
  const inverted = invert(userRoleMapping)
  return inverted[enUserRole as keyof typeof inverted] ?? enUserRole
}
