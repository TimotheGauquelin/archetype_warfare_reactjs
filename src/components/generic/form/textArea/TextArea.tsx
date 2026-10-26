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
    <div className={`flex flex-col rounded-md ${className ?? ""}`}>
      {label && (
        <label htmlFor={textareaId} className="mt-2 font-bold">
          {label}:{" "}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name="description"
        rows={4}
        value={value}
        onChange={onChange}
        disabled={disabled ? true : false}
        aria-label={label ? undefined : "description"}
        className={`mt-2 p-2 bg-white border border-slate-100 rounded-md outline-none focus:outline-none resize-y ${
          disabled ? "opacity-50" : ""
        }`}
      />
    </div>
  );
};

export default TextArea;
