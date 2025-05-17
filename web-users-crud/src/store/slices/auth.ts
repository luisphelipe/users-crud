import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type User = {
    id: string;
    name: string;
    email: string;
};

interface InitialState {
    user?: User;
    token?: string;
}

const initialState: InitialState = {
    user: undefined,
    token: undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state: any, action: any) => {
            state.user = {
                ...action.payload.user,
                loggedin_at: new Date(),
            };
            state.token = action.payload.access_token;
        },
        logout: (state: any) => {
            state.user = undefined;
            state.token = undefined;
        },
    },
});

// selectors
export const getUser = (state: RootState) => state.auth.user;
export const getAuthToken = (state: RootState) => state.auth.token;

// actions & reducer
export const { actions, reducer } = authSlice;
