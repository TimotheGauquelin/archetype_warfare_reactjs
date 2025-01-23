import React from "react";

const ItemsMapping = (title, array, itemName) => {
  return (
    <div className="flex flex-col w-1/3 p-5 mx-3">
      <h3 className="font-bold" style={{ fontSize: "24px" }}>
        {title}
      </h3>
      <div className="grid grid-cols-10 gap-4 pt-5">
        {array.attribute
          ?.sort((a, b) => a.label.localeCompare(b.label))
          ?.slice(0, 10)
          ?.map((item) => (
            <div key={item.id} className="col-span-2 text-center">
              <div>
                <img
                  className="w-full"
                  src={`${process.env.PUBLIC_URL}/assets/${itemName}Icon/${item.label}.png`}
                  alt=""
                />
              </div>
              <label htmlFor="">{item.label}</label>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ItemsMapping;
