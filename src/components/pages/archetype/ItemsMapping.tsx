import type { ReactNode } from "react";

interface ItemWithLabel {
  id: number;
  label: string;
  [key: string]: unknown;
}

interface ItemsMappingProps {
  title: string;
  array: { attribute?: ItemWithLabel[] };
  itemName: string;
}

const ItemsMapping = ({ title, array, itemName }: ItemsMappingProps): ReactNode => {
  return (
    <div className="flex flex-col w-1/3 p-5 mx-3">
      <h3 className="font-bold" style={{ fontSize: "24px" }}>
        {title}
      </h3>
      <div className="grid grid-cols-10 gap-4 pt-5">
        {array.attribute
          ?.sort((a: ItemWithLabel, b: ItemWithLabel) => a.label.localeCompare(b.label))
          ?.slice(0, 10)
          ?.map((item: ItemWithLabel) => (
            <div key={item.id} className="col-span-2 text-center">
              <div>
                <img
                  className="w-full"
                  src={`${import.meta.env.BASE_URL}assets/${itemName}Icon/${item.label}.png`}
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
