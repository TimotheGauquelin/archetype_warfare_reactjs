import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

export const TournamentDropDown = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <div className={`py-4`}>
            <div className={`p-2 flex flex-row justify-between items-center bg-gray-300 ${isCollapsed ? "rounded-lg" : "rounded-t-lg"}`}>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {title}
                </h2>
                <span className="cursor-pointer text-lg" onClick={() => { setIsCollapsed(!isCollapsed) }}>
                    {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                </span>
            </div>
            <div className={`p-4 bg-gray-100 ${isCollapsed ? "hidden" : "rounded-b-lg"}`}>
                {children}
            </div>
        </div>
    )
}