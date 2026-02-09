const TextArea = ({ label, required, value, onChange, className, disabled }: { label: string, required: boolean, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, className?: string, disabled?: boolean }) => {
    return (
        <div className={`flex flex-col mb-2 rounded-md ${className}`}>
            {label && (
                <label className="mt-2 font-medium">
                    {label}:{" "}
                    {required && <span className="text-red-500 font-bold">*</span>}
                </label>
            )}
            <textarea
                name="description"
                value={value}
                onChange={onChange}
                disabled={disabled ? true : false}
                className={`mt-2 p-2 bg-gray-100 rounded-md ${disabled ? "opacity-50 hover:outline-none" : "hover:opacity-90 hover:outline hover:outline-2 hover:outline-black"}`}
            />
        </div>
    );
};

export default TextArea;