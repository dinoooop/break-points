export interface User {
    id: number;
    full_name: string;
    email: string;
    avatar: string | null;
    is_staff?: boolean;
    created_at?: string;
    updated_at?: string;
}

