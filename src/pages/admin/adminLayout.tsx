import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminBody from "../../components/pages/admin/AdminBody";
import AdminHeader from "../../components/pages/admin/AdminHeader";
import AdminSideBar from "../../components/pages/admin/AdminSidebar";
import { clearInactiveAdminListPages } from "../../constant/adminPaginationScopes";

interface AdminStructureProps {
  children: React.ReactNode;
}

const SSCREEN_MQ = "(min-width: 769px)";

const AdminLayout: React.FC<AdminStructureProps> = ({ children }) => {
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [headerBottom, setHeaderBottom] = useState(56);
  const [displayedNavbar, setDisplayedNavbar] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(SSCREEN_MQ).matches : true
  );

  useEffect(() => {
    clearInactiveAdminListPages(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const media = window.matchMedia(SSCREEN_MQ);
    const onChange = () => {
      setDisplayedNavbar(media.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const updateHeight = () => {
      const bottom = headerEl.getBoundingClientRect().bottom;
      setHeaderBottom(bottom);
      setContentHeight(Math.max(0, window.innerHeight - bottom));
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(headerEl);
    // FreeHostingBanner / StreamBar live outside this layout
    resizeObserver.observe(document.body);
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const closeMobileNavbar = useCallback(() => {
    if (!window.matchMedia(SSCREEN_MQ).matches) {
      setDisplayedNavbar(false);
    }
  }, []);

  const heightPx =
    contentHeight > 0 ? `${contentHeight}px` : "calc(100dvh - 5rem)";

  return (
    <>
      <div ref={headerRef}>
        <AdminHeader
          displayedNavbar={displayedNavbar}
          setDisplayedNavbar={setDisplayedNavbar}
        />
      </div>
      <div
        className="relative sscreen:grid sscreen:grid-cols-12 overflow-hidden"
        style={{ height: heightPx }}
      >
        {displayedNavbar && (
          <button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-30 bg-black/40 sscreen:hidden"
            style={{ top: headerBottom }}
            onClick={() => setDisplayedNavbar(false)}
          />
        )}
        <AdminSideBar
          displayedNavbar={displayedNavbar}
          onNavigate={closeMobileNavbar}
          contentHeight={contentHeight}
          headerBottom={headerBottom}
        />
        <AdminBody displayedNavbar={displayedNavbar} contentHeight={contentHeight}>
          {children}
        </AdminBody>
      </div>
    </>
  );
};

export default AdminLayout;
