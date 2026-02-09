import React from "react";
import { dateToInputDate } from "../../../utils/date/verbalDate";

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
                <label className="mt-2 font-medium">
                    {label}:{" "}
                    {required && <span className="text-red-500 font-bold">*</span>}
                </label>
            )}
            <input
                required={required}
                className="p-2 bg-gray-100 rounded-md"
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
