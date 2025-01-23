export const FormikCheckboxInput = ({
  option,
  array,
  form: { setFieldValue },
  field: { name, value },
}) => {
  return (
    <div className="flex grid grid-cols-12">
      {option.map((op, index) => {
        const findIndex = value.findIndex(
          (element) => element.label === op.label
        );

        return (
          <div
            className="lscreen:col-span-3 sscreen:col-span-4 col-span-6"
            key={index}
          >
            <input
              type="checkbox"
              defaultChecked={value[findIndex]?.label}
              value={op.label}
              name={op.label}
              onClick={(e) => {
                if (e.target.checked === true) {
                  console.log(e.target.checked, e.target.value);
                  value.push({ label: e.target.value });
                  setFieldValue(name, value);
                } else {
                  const findIndex = value.findIndex(
                    (item) => item.label === e.target.value
                  );
                  value.splice(findIndex, 1);
                }
              }}
            />
            <label htmlFor={op.label}>{op.label}</label>
          </div>
        );
      })}
    </div>
  );
};
