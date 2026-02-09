import type { CardWithBanlistStatus } from "../../types";

interface FormikBanlistCardsFieldProps {
  cards?: CardWithBanlistStatus[];
  form: {
    setFieldValue: (field: string, value: CardWithBanlistStatus[]) => void;
  };
  field: {
    name: string;
    value: CardWithBanlistStatus[];
  };
}

const FormikBanlistCardsField: React.FC<FormikBanlistCardsFieldProps> = ({
  cards,
}) => {
  cards?.map((card: CardWithBanlistStatus) => {
    if (card.card?.archetype_id === null) {
      // Logique à implémenter si nécessaire
    }
    return null;
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
