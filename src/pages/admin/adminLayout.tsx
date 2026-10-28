import React, { useCallback, useEffect, useState } from "react";
import AdminBody from "../../components/pages/admin/AdminBody";
import AdminHeader from "../../components/pages/admin/AdminHeader";
import AdminSideBar from "../../components/pages/admin/AdminSidebar";

interface AdminStructureProps {
  children: React.ReactNode;
}

const SSCREEN_MQ = "(min-width: 769px)";

const AdminLayout: React.FC<AdminStructureProps> = ({ children }) => {
  const [displayedNavbar, setDisplayedNavbar] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(SSCREEN_MQ).matches : true
  );

  useEffect(() => {
    const media = window.matchMedia(SSCREEN_MQ);
    const onChange = () => {
      setDisplayedNavbar(media.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const closeMobileNavbar = useCallback(() => {
    if (!window.matchMedia(SSCREEN_MQ).matches) {
      setDisplayedNavbar(false);
    }
  }, []);

  return (
    <>
      <AdminHeader
        displayedNavbar={displayedNavbar}
        setDisplayedNavbar={setDisplayedNavbar}
      />
      <div className="relative sscreen:grid sscreen:grid-cols-12">
        {displayedNavbar && (
          <button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 top-20 z-30 bg-black/40 sscreen:hidden"
            onClick={() => setDisplayedNavbar(false)}
          />
        )}
        <AdminSideBar
          displayedNavbar={displayedNavbar}
          onNavigate={closeMobileNavbar}
        />
        <AdminBody displayedNavbar={displayedNavbar}>{children}</AdminBody>
      </div>
    </>
  );
};

export default AdminLayout;
