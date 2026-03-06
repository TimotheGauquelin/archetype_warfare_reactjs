import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <div className={`py-2`}>
            <div className={`p-2 flex flex-row justify-between items-center bg-gray-300 ${isCollapsed ? "rounded-lg" : "rounded-t-lg"}`}>
                <h2 className="text-md font-bold text-gray-900">
                    {title}
                </h2>
                <span className="cursor-pointer text-lg" onClick={() => { setIsCollapsed(!isCollapsed) }}>
                    {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                </span>
            </div>
            <div className={`p-2 space-y-2 bg-gray-100 ${isCollapsed ? "hidden" : "rounded-b-lg"}`}>
                {children}
            </div>
        </div>
    )
}

export default Section;