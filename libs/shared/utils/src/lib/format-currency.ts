
export const CURRENCY_MAP = {
    EUR: { symbol: '€', decimalPlaces: 2, format: '${symbol}${amount}' },
    USD: { symbol: '$', decimalPlaces: 2, format: '${symbol}${amount}' },
    VND: { symbol: '₫', decimalPlaces: 0, format: '${amount} ${symbol}' },
    TRY: { symbol: '₺', decimalPlaces: 2, format: '${symbol}${amount}' },
    RUB: { symbol: '₽', decimalPlaces: 2, format: '${amount} ${symbol}' },
    PLN: { symbol: 'zł', decimalPlaces: 2, format: '${amount} ${symbol}' },
    PHP: { symbol: '₱', decimalPlaces: 2, format: '${symbol}${amount}' },
    PEN: { symbol: 'S/', decimalPlaces: 2, format: '${symbol}${amount}' },
    NGN: { symbol: '₦', decimalPlaces: 2, format: '${symbol}${amount}' },
    MXN: { symbol: '$', decimalPlaces: 2, format: '${symbol}${amount}' },
    KRW: { symbol: '₩', decimalPlaces: 0, format: '${amount}${symbol}' },
    JPY: { symbol: '¥', decimalPlaces: 0, format: '${amount}${symbol}' },
    INR: { symbol: '₹', decimalPlaces: 2, format: '${symbol}${amount}' },
    IDR: { symbol: 'Rp', decimalPlaces: 2, format: '${symbol}${amount}' },
    DKK: { symbol: 'kr', decimalPlaces: 2, format: '${amount} ${symbol}' },
    CNY: { symbol: '¥', decimalPlaces: 2, format: '${amount}${symbol}' },
    CLP: { symbol: '$', decimalPlaces: 0, format: '${symbol}${amount}' },
    CAD: { symbol: 'C$', decimalPlaces: 2, format: '${symbol}${amount}' },
    BRL: { symbol: 'R$', decimalPlaces: 2, format: '${symbol}${amount}' },
    ARS: { symbol: '$', decimalPlaces: 2, format: '${symbol}${amount}' },
    // Unsupported
    // GBP: { symbol: '£', decimalPlaces: 2, format: '${symbol}${amount}' },
    // AUD: { symbol: 'A$', decimalPlaces: 2, format: '${symbol}${amount}' },
    // CHF: { symbol: 'CHF', decimalPlaces: 2, format: '${amount} ${symbol}' },
    // SEK: { symbol: 'kr', decimalPlaces: 2, format: '${amount} ${symbol}' },
    // NZD: { symbol: 'NZ$', decimalPlaces: 2, format: '${symbol}${amount}' },
    // SGD: { symbol: 'S$', decimalPlaces: 2, format: '${symbol}${amount}' },
    // HKD: { symbol: 'HK$', decimalPlaces: 2, format: '${symbol}${amount}' },
    // NOK: { symbol: 'kr', decimalPlaces: 2, format: '${amount} ${symbol}' },
    // ZAR: { symbol: 'R', decimalPlaces: 2, format: '${symbol}${amount}' },
    // CZK: { symbol: 'Kč', decimalPlaces: 2, format: '${amount} ${symbol}' },
    // HUF: { symbol: 'Ft', decimalPlaces: 2, format: '${amount} ${symbol}' },
    // ILS: { symbol: '₪', decimalPlaces: 2, format: '${symbol}${amount}' },
    // MYR: { symbol: 'RM', decimalPlaces: 2, format: '${symbol}${amount}' },
    // THB: { symbol: '฿', decimalPlaces: 2, format: '${symbol}${amount}' },
    // AED: { symbol: 'د.إ', decimalPlaces: 2, format: '${amount} ${symbol}' },
    // SAR: { symbol: 'ر.س', decimalPlaces: 2, format: '${amount} ${symbol}' },
    // PKR: { symbol: '₨', decimalPlaces: 2, format: '${symbol}${amount}' },
    // EGP: { symbol: '£', decimalPlaces: 2, format: '${symbol}${amount}' },
    // BDT: { symbol: '৳', decimalPlaces: 2, format: '${symbol}${amount}' },
    // KWD: { symbol: 'د.ك', decimalPlaces: 3, format: '${amount} ${symbol}' },
    // BHD: { symbol: '.د.ب', decimalPlaces: 3, format: '${amount} ${symbol}' },
    // OMR: { symbol: '﷼', decimalPlaces: 3, format: '${amount} ${symbol}' },
    // JOD: { symbol: 'د.ا', decimalPlaces: 3, format: '${amount} ${symbol}' },
    // IQD: { symbol: 'ع.د', decimalPlaces: 3, format: '${amount} ${symbol}' },
    // ISK: { symbol: 'kr', decimalPlaces: 0, format: '${amount} ${symbol}' },
} as const satisfies Record<
    string,
    { symbol: string; decimalPlaces: number; format: string }
>;

export const CURRENCIES = Object.entries(CURRENCY_MAP).map(([key, value]) => {
    return { value: key, label: `${key} ${value.symbol}` };
});

export const formatCurrency = (value: number, currency = 'USD') => {
    const item = CURRENCY_MAP[currency as keyof typeof CURRENCY_MAP];

    if (!item) throw new Error('Currency does not exist');

    const { decimalPlaces, symbol, format } = item;

    let formattedAmount;

    // Check if the number has decimals
    if (value % 1 !== 0) {
        // Keep two decimal places
        formattedAmount = value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    } else {
        // No decimal places for whole numbers
        formattedAmount = value.toLocaleString('en-US', {
            maximumFractionDigits: 0,
        });
    }

    return format
        .replace('${symbol}', symbol)
        .replace('${amount}', formattedAmount);
};


const formatCurrencyForBetRange = (
    value: number | null,
    currency = 'USD'
): string => {
    if (value === null) return '';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: value % 1 === 0 ? 0 : 2, // Removes trailing 0's if no cents
    }).format(value);
};

export const formatBetRange = (
    minBet: number,
    maxBet: number | null,
    currency = 'USD'
): string => {
    const formattedMinBet = formatCurrencyForBetRange(minBet, currency);
    if (maxBet === null) {
        return `${formattedMinBet}+`;
    }
    const formattedMaxBet = formatCurrencyForBetRange(maxBet, currency);
    return `${formattedMinBet} - ${formattedMaxBet}`;
};
