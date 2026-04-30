import type { Subject } from "./SubjectItem";

export interface BreakPoint {
    id: number;
    subject: number | Subject;
    description: string;
    end_date?: string | null;
    end_reading?: number | null;
    reading_date?: string | null;
    status: string;
    th?: number | null;
    cv?: number | null;
    rm?: number | null;
    ex?: number | null;
    created_at?: string;
    updated_at?: string;
}

