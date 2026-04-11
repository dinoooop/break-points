import React from "react";
import { clock } from "../../bootstrap/shsm/clock";

interface InputSingleDateCalendarProps {

    name: string;
    fieldSet: Record<string, any>;
    formValues: Record<string, any>;
    onChangeForm: (name: string, value: any) => void;
}

const InputSingleDateCalendar: React.FC<InputSingleDateCalendarProps> = ({
    name,
    fieldSet,
    formValues,
    onChangeForm
}) => {

    if (!fieldSet[name]) {
        throw new Error(`${name} not found`);
    }

    const newId = fieldSet[name].id;
    const newLabel = fieldSet[name].label;

    const value = formValues[name] ?? "";

    const parsedDate = new Date(value);

    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth(); // 0-based
    const today = new Date();

    

    const onSelect = (selected: string) => {
        console.log(selected);
    };

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let currentDay = 1;

    const rows: React.ReactElement[] = [];

    for (let i = 0; i < 6; i++) {
        const cells: React.ReactElement[] = [];

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cells.push(<td key={`empty-start-${j}`}></td>);
            } else if (currentDay > daysInMonth) {
                cells.push(<td key={`empty-end-${j}`}></td>);
            } else {
                const cellDate = clock.formatDate(year, month, currentDay);

                const isSelected = value === cellDate;
                const isToday =
                    today.getFullYear() === year &&
                    today.getMonth() === month &&
                    today.getDate() === currentDay;

                let cellClassName = 'calendar-cell';
                if (isSelected) {
                    cellClassName += ' selected-date';
                }
                if (isToday) {
                    cellClassName += ' today-date';
                }

                cells.push(
                    <td
                        key={currentDay}
                        className={cellClassName}
                        onClick={() => onSelect(cellDate)}
                    >
                        {currentDay}
                    </td>
                );

                currentDay++;
            }
        }

        rows.push(<tr key={i}>{cells}</tr>);

        if (currentDay > daysInMonth) break;
    }


    const onChangeInputField = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeForm(name, e.target.value);
    };

    return (
        <div className="display-calendar bg-dark-hover">
            <table border={1} cellPadding={5} cellSpacing={0}>
                <thead>
                    <tr>
                        {days.map(day => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};

export default InputSingleDateCalendar;
