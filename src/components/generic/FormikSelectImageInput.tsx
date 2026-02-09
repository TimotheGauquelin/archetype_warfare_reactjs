import React, { useState } from "react";

interface ImageOption {
  url: string;
  name: string;
}

interface FormikSelectImageInputProps {
  option?: ImageOption[];
  littleImg?: boolean;
  form: {
    setFieldValue: (field: string, value: string) => void;
  };
  field: {
    name: string;
    value: string;
  };
}

export const FormikSelectImageInput: React.FC<FormikSelectImageInputProps> = ({
  option,
  littleImg,
  form: { setFieldValue },
  field: { name, value },
}) => {
  const [newImg, setNewImg] = useState("");

  return (
    <div className="mt-2">
      <div style={{ maxWidth: littleImg ? "200px" : undefined }}>
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
        disabled={false}
        onChange={(e) => {
          // eslint-disable-next-line no-unused-expressions
          setFieldValue(name, e.target.value);
          setNewImg(e.target.value);
        }}
      >
        {option &&
          option.map((op: ImageOption, index: number) => (
            <option key={index} value={op?.url}>
              {op?.name}
            </option>
          ))}
      </select>
    </div>
  );
};
