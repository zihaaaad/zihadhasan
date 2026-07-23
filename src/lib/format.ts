/**
 * Centralized, locale-aware currency & date formatting.
 *
 * Previously currency was rendered as ad-hoc string concatenation (e.g. `৳${price}`)
 * and dates were formatted with `toLocaleDateString('en-US', ...)` hardcoded at each
 * call site. That meant no thousands separators on currency, inconsistent symbols
 * ($ was used in one admin widget while everywhere else used ৳ for the same BDT
 * amounts), and no single place to change locale/currency behavior later.
 *
 * These helpers use Intl.NumberFormat / Intl.DateTimeFormat under the hood so
 * grouping, separators, and date formatting follow the given locale, while the
 * currency symbol itself is looked up from a small map rather than relying on
 * the runtime's ICU currency-symbol data (which is inconsistent across
 * Node/browser environments for BDT specifically).
 */

const DEFAULT_LOCALE = "en-US";
const DEFAULT_CURRENCY = "BDT";

const CURRENCY_SYMBOLS: Record<string, string> = {
    BDT: "৳",
    USD: "$",
    EUR: "€",
    GBP: "£",
};

export interface FormatCurrencyOptions {
    locale?: string;
    currency?: string;
    /** Show decimal places (default: false, matches existing whole-taka pricing). */
    showDecimals?: boolean;
}

export function formatCurrency(
    amount: number | null | undefined,
    options: FormatCurrencyOptions = {}
): string {
    const value = amount ?? 0;
    const { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY, showDecimals = false } = options;
    const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;

    const formattedNumber = new Intl.NumberFormat(locale, {
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(value);

    return `${symbol}${formattedNumber}`;
}

type DateLike = Date | { seconds: number } | string | number;

function toDate(input: DateLike): Date | null {
    if (input instanceof Date) return input;
    if (typeof input === "object" && input !== null && "seconds" in input) {
        return new Date(input.seconds * 1000);
    }
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
}

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
    locale?: string;
}

/**
 * Formats a Date, JS timestamp, ISO string, or Firestore Timestamp-shaped
 * object ({ seconds: number }) consistently. Returns "" for null/undefined/invalid input.
 */
export function formatDate(
    input: DateLike | null | undefined,
    options: FormatDateOptions = {}
): string {
    if (input === null || input === undefined) return "";
    const date = toDate(input);
    if (!date) return "";

    const { locale = DEFAULT_LOCALE, ...dtOptions } = options;
    const hasOptions = Object.keys(dtOptions).length > 0;

    return new Intl.DateTimeFormat(locale, hasOptions ? dtOptions : {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

export function formatMonthShort(input: DateLike | null | undefined, locale = DEFAULT_LOCALE): string {
    return formatDate(input, { locale, month: "short" });
}
