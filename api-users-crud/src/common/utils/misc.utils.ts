// " 123-123" => "123123"
export const toNumericString = (value: string) => {
    if (!value) return undefined;
    return value.replace(/[^\d]+/g, '');
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const random_thousand = (min = 1000, max = 9999) => Math.floor(Math.random() * (max - min) + min);

export const documentMatchesCPFLength = (document: string) => {
    return document.length === 11;
};
