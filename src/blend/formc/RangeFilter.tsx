import React, { useState } from "react";
import { fm } from "./fm";

interface RangeFilterProps {
    name: string;
    onChangeForm: (name: string, value: any) => void;
    id?: string | null;
    label?: string;
    min: number;
    max: number;
    step?: number;
    unit?: string;
}

const RangeFilter: React.FC<RangeFilterProps> = ({
    name,
    onChangeForm,
    id = null,
    label, min, max, step = 1, unit = ""
}) => {
    const newId = id ?? name;
    const newLabel = label || fm.getLabel(name);
    // const value = formValues[name] ?? "";
    // const error = errors[name] ?? "";

    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxValue - step);
        setMinValue(value);
        onChangeForm(name + '_min', e.target.value);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minValue + step);
        setMaxValue(value);
        onChangeForm(name + '_max', e.target.value);
    };

    // Calculate fill percentage for dynamic track
    const rangePercentMin = ((minValue - min) / (max - min)) * 100;
    const rangePercentMax = ((maxValue - min) / (max - min)) * 100;

    return (
        <div className="filter-group" id={newId}>
            <h4>{newLabel}</h4>
            <div className="range-slider">
                <div
                    className="range-track"
                    style={{
                        background: `linear-gradient(
              to right,
              #ddd ${rangePercentMin}%,
              #0077ff ${rangePercentMin}%,
              #0077ff ${rangePercentMax}%,
              #ddd ${rangePercentMax}%
            )`,
                    }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minValue}
                    onChange={handleMinChange}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxValue}
                    onChange={handleMaxChange}
                />
            </div>
            <div className="range-values">
                <span>{minValue}{unit}</span>
                <span>{maxValue}{unit}</span>
            </div>
        </div>
    );
};

export default RangeFilter