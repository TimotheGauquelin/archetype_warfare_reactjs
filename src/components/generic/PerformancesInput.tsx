import React from "react";

interface Performance {
  label: string;
  note: number | string;
}

interface PerformancesInputProps {
  arrayLabel: string[];
  form: {
    setFieldValue: (field: string, value: Performance[]) => void;
  };
  field: {
    name: string;
    value: Performance[];
  };
}

const PerformancesInput: React.FC<PerformancesInputProps> = ({
  arrayLabel,
  form: { setFieldValue },
  field: { name, value },
}) => {
  return (
    <div className="grid grid-cols-10 gap-4">
      {arrayLabel.map((label: string, index: number) => {
        const performanceIndex = value.findIndex((v: Performance) => v.label === label);
        return (
          <div key={index} className="flex flex-col col-span-2">
            <label htmlFor="">{label}</label>
            <input
              className="mt-2"
              value={performanceIndex >= 0 ? value[performanceIndex]?.note : ''}
              type="number"
              min="0"
              max="10"
              name="performances"
              onChange={(e) => {
                const newValue = [...value];
                if (performanceIndex >= 0) {
                  newValue[performanceIndex] = {
                    ...newValue[performanceIndex],
                    note: Number(e.target.value),
                  };
                } else {
                  newValue.push({
                    label: label,
                    note: Number(e.target.value),
                  });
                }
                setFieldValue(name, newValue);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PerformancesInput;
