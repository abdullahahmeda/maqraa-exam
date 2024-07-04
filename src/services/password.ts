import crypto from 'node:crypto'

const keyDerivationPrf = ['sha1', 'sha256', 'sha512']

// Porting from https://github.com/dotnet/aspnetcore/blob/3f1acb59718cadf111a0a796681e3d3509bb3381/src/Identity/Extensions.Core/src/PasswordHasher.cs#L166
export function verifyHashedPassword(
  hashedPassword: string,
  providedPassword: string,
): boolean {
  const hashedPasswordBytes = Buffer.from(hashedPassword, 'base64')
  if (hashedPasswordBytes.length === 0) return false

  switch (hashedPasswordBytes[0]) {
    case 0x00:
      if (verifyHashedPasswordV2(hashedPasswordBytes, providedPassword)) {
        return true
      }
      return false

    case 0x01:
      if (verifyHashedPasswordV3(hashedPasswordBytes, providedPassword)) {
        return true
      }
      return false

    default:
      return false
  }
}

// With help from: https://stackoverflow.com/a/28728361
function verifyHashedPasswordV2(
  hashedPasswordBytes: Buffer,
  password: string,
): boolean {
  const saltSize = 128 / 8
  const pbkdf2SubkeyLength = 256 / 8

  const salt = Buffer.alloc(saltSize)
  salt.copy(hashedPasswordBytes, 1)

  const expectedSubkey = Buffer.alloc(pbkdf2SubkeyLength)
  expectedSubkey.copy(hashedPasswordBytes, 1 + salt.length)

  const actualSubkey = crypto.pbkdf2Sync(
    Buffer.from(password),
    salt,
    1000,
    256,
    'sha1',
  )

  if (actualSubkey.equals(expectedSubkey)) {
    return true
  }
  return false
}

function verifyHashedPasswordV3(
  hashedPasswordBytes: Buffer,
  password: string,
): boolean {
  try {
    // Read header information
    const prf = keyDerivationPrf[readNetworkByteOrder(hashedPasswordBytes, 1)]!
    const iterCount = readNetworkByteOrder(hashedPasswordBytes, 5)
    const saltLength = readNetworkByteOrder(hashedPasswordBytes, 9)

    // Read the salt: must be >= 128 bits
    if (saltLength < 128 / 8) {
      return false
    }

    const salt = Buffer.alloc(saltLength)
    salt.copy(hashedPasswordBytes, 13)

    // Read the subkey (the rest of the payload): must be >= 128 bits
    const subkeyLength = hashedPasswordBytes.length - 13 - salt.length
    if (subkeyLength < 128 / 8) {
      return false
    }
    const expectedSubkey = Buffer.alloc(subkeyLength)
    expectedSubkey.copy(hashedPasswordBytes, 13 + salt.length)

    const actualSubkey = crypto.pbkdf2Sync(
      Buffer.from(password),
      salt,
      iterCount,
      subkeyLength,
      prf,
    )

    if (actualSubkey.equals(expectedSubkey)) {
      return true
    }
  } catch {
    return false
  }
  return false
}

function readNetworkByteOrder(buffer: Buffer, offset: number) {
  return (
    (buffer[offset + 0]! << 24) |
    (buffer[offset + 1]! << 16) |
    (buffer[offset + 2]! << 8) |
    buffer[offset + 3]!
  )
}
/*
export function hashPassword(password: string) {}

function hashPasswordV2(password: string, rng: RandomNumberGenerator) {
  const pbkdf2Prf = 'sha1'
  const pbkdf2IterCount = 1000 // default for Rfc2898DeriveBytes
  const pbkdf2SubkeyLength = 256 / 8 // 256 bits
  const saltSize = 128 / 8 // 128 bits

  // Produce a version 2 (see comment above) text hash.
  const salt = Buffer.alloc(saltSize)
  rng.GetBytes(salt)
  const subkey = crypto.pbkdf2Sync(
    password,
    salt,
    pbkdf2IterCount,
    pbkdf2SubkeyLength,
    pbkdf2Prf,
  )

  const outputBytes = Buffer.alloc(1 + saltSize + pbkdf2SubkeyLength)
  outputBytes[0] = 0x00 // format marker
  outputBytes.copy(salt, 0, 1, saltSize)
  outputBytes.copy(subkey, 0, 1 + saltSize, pbkdf2SubkeyLength)
  return outputBytes
}
*/
