import React from "react";

interface ActiveBreakPointProps {
    subject: Record<string, any>;
    category: Record<string, any> | null;
    showTodayTitle?: boolean;
}

const ActiveBreakPoint: React.FC<ActiveBreakPointProps> = ({ subject, category, showTodayTitle }) => {
    const th = subject.threshold ?? 0;
    let cv = 0
    let rm = 0
    let ex = 0
    if (subject.mode == 'date_type') {
        const today = new Date();
        if(subject.last_end_date){
            
            const endDate = new Date(subject.last_end_date ?? '');
            const diffTime = today.getTime() - endDate.getTime();
            console.log('endDate', endDate);
            cv = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } else {
            cv = 0
        }
        
    } else if (subject.mode == 'reading_type') {
        if(subject.last_end_reading){
            const endReading = subject.last_end_reading ?? 0;
            const currentReading = category?.category_current_reading ?? 0;
            cv = Math.abs(currentReading - endReading);
        } else {
            cv = 0
        }
    }

    if (cv <= th) {
        ex = 0
        rm = th - cv
    }
    else {
        ex = cv - th
        rm = 0
    }

    const exClass = ex > 0 ? 'color-danger' : '';
    return (
        <div key={subject.id}>
            <h2>{showTodayTitle ? 'Today' : subject.title}</h2>
            <div className="count-info">
                <p>TH: {th ?? "-"}</p>
                <p>CV: {cv ?? "-"}</p>
                <p>RM: {rm ?? "-"}</p>
                <p className={exClass}>EX: {ex ?? "-"}</p>
            </div>
        </div>
    );
};

export default ActiveBreakPoint;