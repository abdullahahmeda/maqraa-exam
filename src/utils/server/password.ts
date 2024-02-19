import bcrypt from 'bcryptjs'

const HASH_ROUNDS = 12

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, HASH_ROUNDS)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}
