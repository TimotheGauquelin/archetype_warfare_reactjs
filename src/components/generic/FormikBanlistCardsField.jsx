import React from "react";

const FormikBanlistCardsField = ({
  cards,
  form: { setFieldValue },
  field: { name, value },
}) => {
  cards?.map((card) => {
    if (card.archetype === null) {
    }
  });

  return (
    <div className="bg-gray-400 col-span-9 mt-2 p-3 rounded">
      <div
        className={`overflow-y-auto col-span-8 grid bg-white p-2 rounded grid-cols-12`}
        style={{ height: "400px" }}
      ></div>
    </div>
  );
};

export default FormikBanlistCardsField;
