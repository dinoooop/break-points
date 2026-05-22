import { create } from 'zustand';
import axios from 'axios';
import config from '../../config';

interface User {
    id: number;
    first_name: string;
    email: string;
    is_staff: boolean;
    avatar: string;
}

interface AuthState {
    loading: boolean;
    serverError: string;
    ssm: string;
    statusCode: number;
    resetBeforeRequest: () => void;
    setErrorResponse: (error: any) => void;

    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    theme: string;
    login: (data: Record<string, any>) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<string | null>;
    checkAuth: () => Promise<void>;
}

const userFromStorage = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser') as string) : null;
const accessFromStorage = localStorage.getItem('access')
const refreshFromStorage = localStorage.getItem('refresh')
const themeFromStorage = localStorage.getItem('theme') ?? 'light';

export const useAuthStore = create<AuthState>((set, get) => ({
    loading: false,
    serverError: '',
    ssm: '',
    statusCode: 0,
    resetBeforeRequest: () => set({
        loading: true,
        serverError: '',
        ssm: '',
    }),
    setErrorResponse: (error: any) => {
        set({
            loading: false,
            serverError: error.response?.data?.message ?? 'Server error',
            ssm: '',
            statusCode: error.response?.status ?? 500,
        });
    },

    user: userFromStorage,
    accessToken: accessFromStorage,
    refreshToken: refreshFromStorage,
    theme: themeFromStorage,

    login: async (data) => {

        try {
            get().resetBeforeRequest()
            const res = await axios.post(`${config.api}/accounts/login/`, data);
            const { user, tokens } = res.data;

            localStorage.setItem('authUser', JSON.stringify(user));
            localStorage.setItem('access', tokens.access);
            localStorage.setItem('refresh', tokens.refresh);

            set({
                loading: false,
                user,
                accessToken: tokens.access,
                refreshToken: tokens.refresh,
            });

            if (user.is_staff) {
                window.location.href = '/admin/categories';
            } else {
                window.location.href = '/admin/categories';
            }

        } catch (err) {
            get().setErrorResponse(err)
            throw err;
        }
    },
    register: async (data) => {

        try {
            get().resetBeforeRequest()
            const res = await axios.post(`${config.api}/accounts/register/`, data);
            const { user, tokens } = res.data;

            localStorage.setItem('authUser', JSON.stringify(user));
            localStorage.setItem('access', tokens.access);
            localStorage.setItem('refresh', tokens.refresh);

            set({
                loading: false,
                user,
                accessToken: tokens.access,
                refreshToken: tokens.refresh,
            });
        } catch (err) {
            get().setErrorResponse(err)
            throw err;
        }
    },
    logout: () => {
        localStorage.removeItem('authUser');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        set({ user: null, accessToken: null, refreshToken: null });
        window.location.href = '/login';
    },
    refreshAccessToken: async () => {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) return null;

        try {
            const res = await axios.post(`${config.api}/api/token/refresh/`, { refresh });
            const newAccess = res.data.access;
            localStorage.setItem('access', newAccess);
            set({ accessToken: newAccess });
            return newAccess;
        } catch (error) {
            get().logout();
            return null;
        }
    },
    checkAuth: async () => {

        const token = localStorage.getItem('access');
        if (!token) {
            get().logout();
            return;
        }

        try {
            await axios.get(`${config.api}/accounts/check/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

        } catch (error: any) {
            if (error.response?.status === 401) {
                const newAccess = await get().refreshAccessToken();
                if (!newAccess) get().logout();
            } else {
                get().logout();
            }
        }
    }

}));