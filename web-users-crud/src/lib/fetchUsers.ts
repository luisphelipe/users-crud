import axios from 'axios';
import { USERS } from '../config/api';

export const fetchUsers = async (page: number = 1): Promise<any> => {
    const { data } = await axios.get(USERS, {
        params: { page },
    });
    return data;
};
