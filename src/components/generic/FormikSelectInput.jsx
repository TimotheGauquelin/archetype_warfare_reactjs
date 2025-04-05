export const FormikSelectInput = ({
  type,
  selectImg,
  option,
  deckData,
  deckCards,
  otherAction,
  form: { setFieldValue },
  field: { name, value },
}) => {
  return (
    <div className="mt-2">
      <select
        className="text-black p-2"
        id="input-form"
        value={selectImg ? value.label : deckData ? value?.id : value?.label}
        disabled={
          deckData &&
          (deckCards[0]?.cards.length >= 1 || deckCards[1]?.cards.length >= 1
            ? true
            : false)
        }
        onChange={(e) => {
          // eslint-disable-next-line no-unused-expressions
          selectImg
            ? (setFieldValue(name, e.target.value), otherAction(e.target.value))
            : (deckData && otherAction(e.target.value),
              setFieldValue(name, { id: e.target.value }));
        }}
      >
        {option &&
          option.map((op, index) => (
            <option key={index} value={op.id}>
              {op.label}
            </option>
          ))}
      </select>
    </div>
  );
};
