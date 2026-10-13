import { useId } from "react";

const TextArea = ({
  label,
  required,
  value,
  onChange,
  className,
  disabled,
}: {
  label: string;
  required: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
}) => {
  const textareaId = useId();

  return (
    <div className={`flex flex-col mb-2 rounded-md ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="mt-2 font-medium">
          {label}:{" "}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name="description"
        value={value}
        onChange={onChange}
        disabled={disabled ? true : false}
        aria-label={label ? undefined : "description"}
        className={`mt-2 p-2 bg-gray-100 rounded-md ${disabled ? "opacity-50 hover:outline-none" : "hover:opacity-90 hover:outline hover:outline-2 hover:outline-black"}`}
      />
    </div>
  );
};

export default TextArea;
