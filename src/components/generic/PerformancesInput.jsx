import React from "react";

const PerformancesInput = ({
  arrayLabel,
  form: { setFieldValue },
  field: { name, value },
  put,
}) => {
  return (
    <div className="grid grid-cols-10 gap-4">
      {arrayLabel.map((label, index) => {
        const performanceIndex = value.findIndex((v) => v.label === label);
        return (
          <div key={index} className="flex flex-col col-span-2">
            <label htmlFor="">{label}</label>
            <input
              className="mt-2"
              //PUT
              value={value[performanceIndex]?.note}
              type="number"
              min="0"
              max="10"
              name="performances"
              onChange={(e) => {
                if (value.find((v) => v.label === label)) {
                  value[performanceIndex].note = Number(e.target.value);
                  setFieldValue(name, value);
                } else {
                  value.push({
                    label: label,
                    note: e.target.value,
                  });
                  setFieldValue(name, value);
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PerformancesInput;
