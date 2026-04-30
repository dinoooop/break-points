export interface Subject {
    id: number;
    category: number;
    title: string;
    description?: string | null;
    mode: string;
    threshold: number;
    last_end_date?: string;
    last_end_reading?: string;
    created_at?: string;
    updated_at?: string;
}

