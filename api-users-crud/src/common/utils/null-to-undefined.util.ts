export const null_to_undefined = <T>(data: any) => {
    const new_data = {} as T;

    for (const key of Object.keys(data)) {
        new_data[key] = data[key] === null ? undefined : data[key];
    }

    return new_data;
};
