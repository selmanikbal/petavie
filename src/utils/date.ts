const MONTHS_TR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

/**
 * Turkish date copy for labels and detail rows. Uses hand-written month names
 * so Hermes and web always match; the device language does not affect output.
 */
export function formatDateTR(date: Date): string {
  return `${date.getDate()} ${MONTHS_TR[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatMonthYearTR(date: Date): string {
  return `${MONTHS_TR[date.getMonth()]} ${date.getFullYear()}`;
}

/** `2024-03-17` — ISO date string for storage. */
export function toISODate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Parses `2024-03-17` as local time; `new Date(string)` would treat it as UTC. */
export function fromISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Native date pickers throw unless `value` is a real `Date`. Form state can
 * briefly hold an ISO string after reload, so we normalise before opening one.
 */
export function coerceDate(value: unknown, fallback: Date = new Date()): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getTime());
  }

  if (typeof value === 'string' && value.length > 0) {
    const iso = fromISODate(value);
    if (iso) return iso;

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return new Date(fallback.getTime());
}
