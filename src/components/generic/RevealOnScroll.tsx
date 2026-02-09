import React, { useEffect, useRef, useState } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  as?: string;
  delay?: number;
  className?: string;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, as = "div", delay = 0, className = "" }) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const base = "p-4 lscreen:p-6 opacity-0 transition-all duration-700 ease-out will-change-transform";
  const shown = "opacity-100 translate-y-0";

  return React.createElement(
    as,
    { ref, className: `${base} ${visible ? shown : ""} ${className}` },
    children
  );
};

export default RevealOnScroll;