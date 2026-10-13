import { useId } from "react";
import { useTranslation } from "react-i18next";

interface SwitchInputProps<T = Record<string, unknown>> {
  label?: string;
  attribute: string;
  data: T;
  setAction: React.Dispatch<React.SetStateAction<T>>;
  condition?: string;
  disabled?: boolean;
  displayRow?: boolean;
}

function SwitchInput<T extends Record<string, unknown>>({
  label,
  attribute,
  data,
  setAction,
  disabled,
  displayRow = false,
}: SwitchInputProps<T>): JSX.Element {
  const { t } = useTranslation();
  const switchId = useId();
  const labelId = `${switchId}-label`;
  const checked = Boolean(data?.[attribute]);

  return (
    <div
      className={`${
        displayRow
          ? "col-span-4 flex flex-row justify-center items-center px-2 space-x-2"
          : "flex flex-col justify-center items-end px-2 space-y-1"
      }`}
    >
      {label && (
        <span id={labelId} className="font-medium">
          {label}
        </span>
      )}
      {displayRow && <span aria-hidden="true">{t("common.no")}</span>}
      <label
        htmlFor={switchId}
        className={`inline-flex relative items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          id={switchId}
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : attribute}
          checked={checked}
          onChange={() => {
            if (!disabled) {
              setAction((prevState) => ({
                ...prevState,
                [attribute]: !checked,
              }));
            }
          }}
          disabled={disabled}
        />
        <span
          aria-hidden="true"
          className="relative w-11 h-6 bg-red-200 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-red-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
        />
      </label>
      {displayRow && <span aria-hidden="true">{t("common.yes")}</span>}
    </div>
  );
}

export { SwitchInput };
