import { useState } from "react";

export const FormikSelectImageInput = ({
  option,
  littleImg,
  form: { setFieldValue },
  field: { name, value },
}) => {
  const [newImg, setNewImg] = useState("");

  return (
    <div className="mt-2">
      <div style={{ maxWidth: littleImg && "200px" }}>
        <img
          className={`w-full border border-black rounded `}
          src={newImg ? newImg : value}
          alt=""
        />
      </div>
      <select
        className="text-black p-2 mt-2"
        id="input-form"
        value={newImg ? newImg : value}
        disabled=""
        onChange={(e) => {
          // eslint-disable-next-line no-unused-expressions
          setFieldValue(name, e.target.value);
          setNewImg(e.target.value);
        }}
      >
        {option &&
          option.map((op, index) => (
            <option key={index} value={op?.url}>
              {op?.name}
            </option>
          ))}
      </select>
    </div>
  );
};
