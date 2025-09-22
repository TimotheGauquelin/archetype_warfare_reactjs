import { dateToInputDate } from "../../../utils/date/verbalDate";

export const DateInput = ({
    label,
    required,
    inputType,
    inputName,
    colSpanWidth,
    attribute,
    data,
    setAction,
    condition,
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
                value={condition === "put" ? dateToInputDate(data[attribute]) : (data && data[attribute])}
                onChange={(e) => {
                    setAction((prevState) => ({
                        ...prevState,
                        [attribute]: e.target.value,
                    }));
                }}
            />
        </div>
    );
};
