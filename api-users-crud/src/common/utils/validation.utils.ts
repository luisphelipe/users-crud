export const requiredFieldMessage = () => {
    return {
        message: ({ property }: any) => {
            return `${property} é um campo de texto obrigatório`;
        },
    };
};

export const requiredNumberMessage = () => {
    return {
        message: ({ property }: any) => {
            return `${property} é um campo numérico obrigatório`;
        },
    };
};

export const validStringMessage = () => {
    return {
        message: ({ property }: any) => {
            return `${property} deve ser um campo de texto`;
        },
    };
};

export const validNumberMessage = () => {
    return {
        message: ({ property }: any) => {
            return `${property} deve ser um campo numérico`;
        },
    };
};

export const validEmailMessage = () => {
    return {
        message: ({ property }: any) => {
            return `${property} deve ser um e-mail válido`;
        },
    };
};

export const validNumericTextMessage = () => {
    return {
        message: ({ property }: any) => {
            return `${property} deve ser uma string númerico`;
        },
    };
};

export const positiveNumberMessage = () => {
    return {
        message: ({ property }: any) => {
            return `${property} deve ser um número positivo`;
        },
    };
};

export const minNumberMessage = (min: string | number) => {
    return {
        message: ({ property }: any) => {
            return `${property} deve ser um número maior que ${min}`;
        },
    };
};

export const maxNumberMessage = (max: string | number) => {
    return {
        message: ({ property }: any) => {
            return `${property} deve ser um número maior que ${max}`;
        },
    };
};
