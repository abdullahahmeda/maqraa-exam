import { UserRole as EnUserRole } from '@prisma/client'
import invert from 'lodash.invert'
import randomize from 'randomatic'

export const userRoleMapping = {
  أدمن: EnUserRole.ADMIN,
  طالب: EnUserRole.STUDENT,
  مصحح: EnUserRole.CORRECTOR,
}

type ArUserRole = keyof typeof userRoleMapping

export const arUserRoleToEn = (arUserRole: string): EnUserRole | string =>
  userRoleMapping[arUserRole as ArUserRole] ?? arUserRole
export const enUserRoleToAr = (enUserRole: string): ArUserRole | string => {
  const inverted = invert(userRoleMapping)
  return inverted[enUserRole as keyof typeof inverted] ?? enUserRole
}

export const getFirstName = (name?: string | null, fallback = 'مستخدم') => {
  return name?.split(' ')[0] || fallback
}

export const generateRandomPassword = () => randomize('aA0!', 12)
