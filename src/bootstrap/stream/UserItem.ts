export interface User {
    id: number;
    first_name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    about: string | null;
    is_staff?: boolean;
    created_at?: string;
    updated_at?: string;
}

