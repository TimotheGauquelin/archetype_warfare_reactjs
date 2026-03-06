import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface AdminSectionTitleProps {
    sectionTitle: string;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

const AdminSectionTitle: React.FC<AdminSectionTitleProps> = ({ sectionTitle, isCollapsed, setIsCollapsed }) => (
    <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-2">
        <h2 className="text-lg font-semibold">
            {sectionTitle}
        </h2>
        <span className="text-xl cursor-pointer text-gray-500" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
        </span>
    </div>
);

export default AdminSectionTitle;