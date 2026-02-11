import { useNavigate } from "react-router-dom";
import Button from "./buttons/classicButton/Button";

interface UserProfileLayoutTitleProps {
    title: string;
    buttonText?: string;
    buttonUrl?: string;
    buttonClassName?: string;
    returnButton?: boolean;
}

const UserProfileLayoutTitle = ({ title, buttonText, buttonUrl, buttonClassName, returnButton }: UserProfileLayoutTitleProps) => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-row justify-between items-center mb-2">
            <h3 data-testid="user-profile-layout-title" className="text-xl font-bold text-black">{title}</h3>
            {returnButton ? (
                <span className="cursor-pointer hover:text-green-400 transition-all duration-200" onClick={() => navigate(-1)}>Retour</span>
            ) : buttonText && buttonUrl ? (
                <Button
                    className={`${buttonClassName} text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm`}
                    buttonText={buttonText}
                    action={() => navigate(buttonUrl)}
                />
            ) : null}
        </div>
    );
}

export default UserProfileLayoutTitle;