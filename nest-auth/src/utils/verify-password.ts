import * as argon2 from 'argon2';

export async function handleVerifyPassword(
  hashedPassword: string,
  toVerifyPassword: string,
): Promise<boolean> {
  const isValid = await argon2.verify(hashedPassword, toVerifyPassword);
  return isValid;
}
