import * as crypto from 'crypto';

export function getQuarterTimestamp(date = new Date()): number {
  const minutes = date.getMinutes();
  const quarter = Math.floor(minutes / 15);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    quarter * 15,
    0,
    0
  ).getTime();
}

export function generateOtp(phone: number, offsetMinutes = 0): string {
  const timestamp = getQuarterTimestamp(new Date(Date.now() + offsetMinutes * 60000));
  const data = `${phone}-${timestamp}`;
  const hash = crypto.createHmac('sha256', process.env.OTP_SECRET || 'default-secret')
    .update(data)
    .digest('hex');
  const code = parseInt(hash.substring(0, 6), 16) % 1000000;
  return code.toString().padStart(6, '0');
}

export function validateOtp(phone: number, code: string): 'valid' | 'expired' | 'invalid' {
  const nowCode = generateOtp(phone, 0);
  const prevCode = generateOtp(phone, -15);

  if (code === nowCode) return 'valid';
  if (code === prevCode) return 'expired';
  return 'invalid';
}
