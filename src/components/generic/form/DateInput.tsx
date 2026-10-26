import { dateToInputDate } from "@/utils/date/date";
import React from "react";

interface DateInputProps {
    label?: string;
    required?: boolean;
    inputType?: string;
    inputName?: string;
    colSpanWidth?: string;
    attribute: string;
    data: Record<string, unknown>;
    setAction: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
    condition?: string;
    min?: string;
    max?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
    label,
    required,
    inputType,
    inputName,
    colSpanWidth,
    attribute,
    data,
    setAction,
    condition,
    min,
    max,
}) => {
    return (
        <div className={`flex flex-col col-span-${colSpanWidth}`}>
            {label && (
                <label className="mt-2 font-bold">
                    {label}:{" "}
                    {required && <span className="text-red-500 font-bold">*</span>}
                </label>
            )}
            <input
                required={required}
                className="mt-2 p-2 bg-white border border-slate-100 rounded-md outline-none focus:outline-none"
                type={inputType}
                name={inputName}
                min={min}
                max={max}
                value={condition === "put" && typeof data[attribute] === 'string' ? dateToInputDate(data[attribute]) : (typeof data[attribute] === 'string' ? data[attribute] : '')}
                onChange={(e) => {
                    setAction((prevState: Record<string, unknown>) => ({
                        ...prevState,
                        [attribute]: e.target.value,
                    }));
                }}
            />
        </div>
    );
};
