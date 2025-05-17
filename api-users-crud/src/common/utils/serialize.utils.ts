import { Decimal } from '@prisma/client/runtime/library';

export const serialize = <T>(record: any, keys: any): T => {
    const serialized: any = {};

    for (const key of keys) {
        let data = record[key];

        if (data instanceof Date) {
            data = data.toISOString();
        }

        // if (isDecimalString(data)) {
        //     data = Number(data).toFixed(2);
        // }

        if (data instanceof Decimal) {
            data = data.toFixed(2);
        }

        serialized[key] = data;
    }

    return serialized;
};

// const isDecimalString = (data: unknown) => {
//     const isString = typeof data === 'string';
//     const isNumber = Number(data);
//     const isFloat = isString && data.includes('.');
//     return isString && isNumber && isFloat;
// };
