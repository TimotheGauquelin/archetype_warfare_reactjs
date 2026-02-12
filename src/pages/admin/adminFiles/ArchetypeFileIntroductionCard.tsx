import { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import { getImagesFromCloudinaryFolder, type CloudinaryImage } from "../../../services/file";

const AdminFilesIntroductionCard = () => {
    const [archetypeIntroductionCardImages, setArchetypeIntroductionCardImages] = useState<CloudinaryImage[]>([]);

    useEffect(() => {
        getImagesFromCloudinaryFolder("introduction_archetypes", setArchetypeIntroductionCardImages);
    }, []);

    return (
        <AdminStructure>
            <AdminBodyHeader
                label="Cartes de Présentation d'Archetype"
                catchphrase="Vérifiez tous les fichiers"
                returnButton={true}
            />
            <div className="grid grid-cols-12">
                {archetypeIntroductionCardImages.map((card, index) => {
                    return (
                        <div
                            className="col-span-4 m-1 rounded border-2 border-black"
                            key={index}
                        >
                            <img className="w-full h-full object-cover" src={card.secure_url || card.url} alt={String(index)} />
                        </div>
                    );
                })}
            </div>
        </AdminStructure>
    );
};

export default AdminFilesIntroductionCard;
