export const CheckboxInput = ({
  label,
  required,
  options,
  colSpanWidth,
  attribute,
  data,
  setAction,
  condition
}) => {
  return (
    <div className="flex flex-col">
      <label className="mt-2 font-medium">
        {label}: {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <div className="flex grid grid-cols-12">
        {options.map((op, index) => {
          const findIndex = data[attribute]?.findIndex(
            (element) => {
              return element.id === op.id
            }
          );

          return (
            <div
              className="lscreen:col-span-3 sscreen:col-span-4 col-span-6"
              key={index}
            >
              <input
                type="checkbox"
                defaultChecked={condition && data[attribute][findIndex]?.label}
                value={op.id}
                name={op.label}
                onClick={(e) => {
                  const value = e.target.value;
                  const isChecked = e.target.checked;
                  console.log(isChecked);
                  setAction((prevState) => {
                    const updateElement = [...prevState[attribute]];
                    if (isChecked) {
                      if (!updateElement.some((item) => item.id === value)) {
                        updateElement.push({ id: Number(value) });
                      }
                    } else {
                      if (findIndex !== -1) {
                        updateElement.splice(findIndex, 1);
                      }
                      // const index = updateElement.findIndex(
                      //   (item) => item.id === value
                      // );
                      // if (index !== -1) {
                      //   updateElement.splice(index, 1);
                      // }
                    }

                    return {
                      ...prevState,
                      [attribute]: updateElement,
                    };
                  });
                }}
              />
              <label htmlFor={op.label}>{op.label}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
