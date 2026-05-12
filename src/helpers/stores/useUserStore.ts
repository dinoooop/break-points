import { create } from "zustand";
import axios from "axios";
import config from "../../config";
import { header } from "../cssm/header";
import type { User } from "../../bootstrap/stream/UserItem";

type ApiError = {
    response?: {
        data?: { message?: string };
        status?: number;
    };
};

interface UserState {
    loading: boolean;
    serverError: string;
    ssm: string;
    statusCode: number;
    resetBeforeRequest: () => void;
    setErrorResponse: (error: unknown) => void;

    items: User[];
    item: User | null;
    perPage: number;
    total: number;
    index: (params?: Record<string, unknown>) => Promise<void>;
    show: (id: number) => Promise<void>;
    store: (data: FormData | Record<string, unknown>) => Promise<void>;
    update: (data: FormData | Record<string, unknown>) => Promise<void>;
    destroy: (id: number) => Promise<void>;
    remove: (id: number) => void;
}

const useUserStore = create<UserState>((set, get) => ({
    loading: false,
    serverError: "",
    ssm: "",
    statusCode: 0,
    resetBeforeRequest: () =>
        set({
            loading: true,
            serverError: "",
            ssm: "",
        }),
    setErrorResponse: (error: unknown) => {
        const err = error as ApiError;
        set({
            loading: false,
            serverError: err.response?.data?.message ?? "Server error",
            ssm: "",
            statusCode: err.response?.status ?? 500,
        });
    },

    items: [],
    item: null,
    perPage: 0,
    total: 0,

    index: async (params = {}) => {
        try {
            get().resetBeforeRequest();
            const response = await axios.get(`${config.api}/users/`, {
                params,
                headers: header.json().headers,
            });

            set({
                items: response.data.results || [],
                perPage: response.data.per_page,
                total: response.data.total_pages,
                loading: false,
            });
        } catch (err) {
            get().setErrorResponse(err);
            throw err;
        }
    },
    show: async (id: number): Promise<void> => {
        try {
            get().resetBeforeRequest();
            const response = await axios.get(`${config.api}/users/show/${id}/`, header.json());
            set({ loading: false, item: response.data });
        } catch (err) {
            get().setErrorResponse(err);
            throw err;
        }
    },
    store: async (data: FormData | Record<string, unknown>): Promise<void> => {
        try {
            get().resetBeforeRequest();
            const theHeader = data instanceof FormData ? header.formdata() : header.json();
            await axios.post(`${config.api}/users/store/`, data, theHeader);
            set({ loading: false });
        } catch (err) {
            get().setErrorResponse(err);
            throw err;
        }
    },
    update: async (data: FormData | Record<string, unknown>): Promise<void> => {
        try {
            get().resetBeforeRequest();
            const theHeader = data instanceof FormData ? header.formdata() : header.json();
            const rawId = data instanceof FormData ? data.get("id") : (data as Record<string, unknown>).id;
            if (rawId === null || rawId === undefined) {
                throw new Error("Missing id for user update");
            }
            const theId = typeof rawId === "string" || typeof rawId === "number" ? rawId : String(rawId);
            await axios.put(`${config.api}/users/update/${theId}/`, data, theHeader);
            set({ loading: false });
        } catch (err) {
            get().setErrorResponse(err);
            throw err;
        }
    },
    destroy: async (id: number): Promise<void> => {
        try {
            get().resetBeforeRequest();
            await axios.delete(`${config.api}/users/delete/${id}/`, header.json());
            set({ loading: false });
        } catch (err) {
            get().setErrorResponse(err);
            throw err;
        }
    },
    remove: (id) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        }));
    },
}));

export default useUserStore;
