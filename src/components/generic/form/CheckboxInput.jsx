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
          const isChecked = data[attribute]?.some(
            (element) => element.id === op.id
          );

          return (
            <div
              className="lscreen:col-span-3 sscreen:col-span-4 col-span-6"
              key={index}
            >
              <input
                type="checkbox"
                checked={isChecked}
                value={op.id}
                name={op.label}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const isChecked = e.target.checked;
                  
                  setAction((prevState) => {
                    const updateElement = [...(prevState[attribute] || [])];
                    
                    if (isChecked) {
                      // Ajouter l'objet complet à la liste si pas déjà présent
                      if (!updateElement.some((item) => item.id === value)) {
                        updateElement.push({ 
                          id: value,
                          label: op.label 
                        });
                      }
                    } else {
                      // Retirer l'objet de la liste
                      const indexToRemove = updateElement.findIndex(
                        (item) => item.id === value
                      );
                      if (indexToRemove !== -1) {
                        updateElement.splice(indexToRemove, 1);
                      }
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
