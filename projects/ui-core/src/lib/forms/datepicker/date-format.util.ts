/**
 * Token-based date formatting/parsing matching PrimeNG/jQuery UI's `dateFormat` tokens:
 *
 *   d  - day of month (no leading zero)      dd - day of month (two digit)
 *   o  - day of the year (no leading zeros)  oo - day of the year (three digit)
 *   D  - day name short                      DD - day name long
 *   m  - month of year (no leading zero)     mm - month of year (two digit)
 *   M  - month name short                    MM - month name long
 *   y  - year (two digit)                    yy - year (four digit)
 *   @  - Unix timestamp (ms since 01/01/1970)
 *   !  - Windows ticks (100ns since 01/01/0001)
 *   '...' - literal text   '' - single quote   anything else - literal text
 *
 * Note this table intentionally has `y`/`yy` mean two/four digit (not `yy`/`yyyy` as in
 * moment.js/ICU-style formats) — that's the PrimeNG/jQuery UI convention this mirrors.
 */
export interface DateFormatNames {
  dayNamesShort: readonly string[];
  dayNames: readonly string[];
  monthNamesShort: readonly string[];
  monthNames: readonly string[];
}

/** Ticks (100ns units) between 0001-01-01 and 1970-01-01, for the `!` token. */
const TICKS_TO_1970 =
  ((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) *
  24 *
  60 *
  60 *
  10000000;

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

export function formatDate(date: Date, format: string, names: DateFormatNames): string {
  const pad = (n: number, len: number) => String(n).padStart(len, '0');
  let output = '';
  let literal = false;

  for (let i = 0; i < format.length; i++) {
    const ch = format[i];

    if (literal) {
      if (ch === "'" && format[i + 1] === "'") {
        output += "'";
        i++;
      } else if (ch === "'") {
        literal = false;
      } else output += ch;
      continue;
    }

    const doubled = format[i + 1] === ch;
    switch (ch) {
      case 'd':
        output += doubled ? pad(date.getDate(), 2) : String(date.getDate());
        if (doubled) i++;
        break;
      case 'o':
        output += doubled ? pad(dayOfYear(date), 3) : String(dayOfYear(date));
        if (doubled) i++;
        break;
      case 'D':
        output += doubled ? names.dayNames[date.getDay()] : names.dayNamesShort[date.getDay()];
        if (doubled) i++;
        break;
      case 'm':
        output += doubled ? pad(date.getMonth() + 1, 2) : String(date.getMonth() + 1);
        if (doubled) i++;
        break;
      case 'M':
        output += doubled
          ? names.monthNames[date.getMonth()]
          : names.monthNamesShort[date.getMonth()];
        if (doubled) i++;
        break;
      case 'y':
        output += doubled ? String(date.getFullYear()) : pad(date.getFullYear() % 100, 2);
        if (doubled) i++;
        break;
      case '@':
        output += String(date.getTime());
        break;
      case '!':
        output += String(date.getTime() * 10000 + TICKS_TO_1970);
        break;
      case "'":
        if (format[i + 1] === "'") {
          output += "'";
          i++;
        } else literal = true;
        break;
      default:
        output += ch;
    }
  }
  return output;
}

export function parseDate(value: string, format: string, names: DateFormatNames): Date | null {
  const input = value.trim();
  let iValue = 0;
  let year = -1,
    month = -1,
    day = -1,
    doy = -1;
  let literal = false;

  const getNumber = (maxSize: number, minSize = 1): number | null => {
    const match = input.slice(iValue).match(new RegExp(`^\\d{${minSize},${maxSize}}`));
    if (!match) return null;
    iValue += match[0].length;
    return parseInt(match[0], 10);
  };

  const getName = (
    shortNames: readonly string[],
    longNames: readonly string[],
    long: boolean,
  ): number | null => {
    const candidates = long ? longNames : shortNames;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (input.substr(iValue, candidate.length).toLowerCase() === candidate.toLowerCase()) {
        iValue += candidate.length;
        return i;
      }
    }
    return null;
  };

  for (let iFormat = 0; iFormat < format.length; iFormat++) {
    const ch = format[iFormat];

    if (literal) {
      if (ch === "'" && format[iFormat + 1] === "'") {
        if (input[iValue] !== "'") return null;
        iValue++;
        iFormat++;
      } else if (ch === "'") {
        literal = false;
      } else {
        if (input[iValue] !== ch) return null;
        iValue++;
      }
      continue;
    }

    const doubled = format[iFormat + 1] === ch;
    switch (ch) {
      case 'd': {
        const n = getNumber(2);
        if (n == null) return null;
        day = n;
        if (doubled) iFormat++;
        break;
      }
      case 'o': {
        const n = getNumber(3);
        if (n == null) return null;
        doy = n;
        if (doubled) iFormat++;
        break;
      }
      case 'D': {
        const n = getName(names.dayNamesShort, names.dayNames, doubled);
        if (n == null) return null;
        if (doubled) iFormat++;
        break;
      }
      case 'm': {
        const n = getNumber(2);
        if (n == null) return null;
        month = n;
        if (doubled) iFormat++;
        break;
      }
      case 'M': {
        const n = getName(names.monthNamesShort, names.monthNames, doubled);
        if (n == null) return null;
        month = n + 1;
        if (doubled) iFormat++;
        break;
      }
      case 'y': {
        const n = doubled ? getNumber(4, 4) : getNumber(2, 2);
        if (n == null) return null;
        year = n;
        if (doubled) iFormat++;
        break;
      }
      case '@': {
        const n = getNumber(14);
        if (n == null) return null;
        const d = new Date(n);
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        break;
      }
      case '!': {
        const n = getNumber(20);
        if (n == null) return null;
        const d = new Date((n - TICKS_TO_1970) / 10000);
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        break;
      }
      case "'": {
        if (format[iFormat + 1] === "'") {
          if (input[iValue] !== "'") return null;
          iValue++;
          iFormat++;
        } else {
          literal = true;
        }
        break;
      }
      default:
        if (input[iValue] !== ch) return null;
        iValue++;
    }
  }

  if (iValue < input.length) return null;

  const now = new Date();
  if (year === -1) {
    year = now.getFullYear();
  } else if (year < 100) {
    const century = now.getFullYear() - (now.getFullYear() % 100);
    const cutoff = (now.getFullYear() % 100) + 10;
    year += year <= cutoff ? century : century - 100;
  }
  if (month === -1) month = now.getMonth() + 1;
  if (day === -1) day = doy === -1 ? now.getDate() : 1;

  const result = doy > -1 ? new Date(year, 0, doy) : new Date(year, month - 1, day);

  if (
    doy === -1 &&
    (result.getFullYear() !== year || result.getMonth() !== month - 1 || result.getDate() !== day)
  ) {
    return null;
  }
  return result;
}
