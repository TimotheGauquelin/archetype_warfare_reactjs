import AdminSectionTitle from "./AdminSectionTitle";
import { useState } from "react";

interface AdminSectionProps {
    adminSectionTitle: string;
    children: React.ReactNode;
}

const AdminSection: React.FC<AdminSectionProps> = ({ adminSectionTitle, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    return (
        <div className="border-gray-200 pb-1">
            <AdminSectionTitle sectionTitle={adminSectionTitle} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`${isCollapsed ? "block" : "hidden"}`}>
                {children}
            </div>
        </div>
    )
}

export default AdminSection;