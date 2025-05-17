export const formatDate = (date?: Date | string | null, includeSeconds?: boolean) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);

    // Create an options object for formatting
    const options = {
        year: 'numeric' as const,
        month: '2-digit' as const,
        day: '2-digit' as const,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        second: includeSeconds ? ('2-digit' as const) : undefined,
        // timeZone: 'America/Sao_Paulo',
        hour12: false, // Use 24-hour format
    };

    // Create an Intl.DateTimeFormat object with the desired options and time zone
    const formatter = new Intl.DateTimeFormat('pt-BR', options);

    // Format the date
    const formattedDate = formatter.format(date).replace(/,/, ''); // Remove comma between date and time

    return formattedDate;
};

export const formatTime = (seconds: number) => {
    if (seconds === undefined || seconds === null) return '';
    const min = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    const sec = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
    return `${min}:${sec}`;
};

export const formatCurrency = (value: string | number, symbol = 'R$') => {
    if (value === undefined || value === null) return '';
    const value_string = Number(value).toFixed(2).replace('.', ',');
    const currency_string = `${symbol}${value_string}`;
    return currency_string;
};

export const formatPercentage = (value: string | number) => {
    if (value === undefined || value === null) return '';
    return `${value}%`;
};

export const getIsoDate = (date = new Date()) => {
    return date.toISOString().split('T')[0];
};

// '10.20' => 1020
export const convertCurrencyToCents = (decimal_value: string) => {
    const currency_cents = Number(decimal_value) * 100;
    const truncated_cents = Math.trunc(currency_cents); // convert float to int (1020.0 => 1020)
    return truncated_cents;
};

export const getIp4FromIpv6 = (ipv6: string) => {
    return ipv6.split(':').pop();
};

export const convertTimeStringToMinuteNumber = (time: string) => {
    const [hour, minutes] = time.split(':').map((ns) => Number(ns));
    if (Number.isNaN(hour) || Number.isNaN(minutes)) throw new Error(`invalid time string: ${time}`);
    return minutes + hour * 60;
};
