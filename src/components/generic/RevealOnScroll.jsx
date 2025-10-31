import React, { useEffect, useRef, useState } from "react";

const RevealOnScroll = ({ children, as: Tag = "div", delay = 0, className = "" }) => {
  const ref = useRef(null);
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

  const base = "opacity-0 translate-y-6 transition-all duration-700 ease-out will-change-transform";
  const shown = "opacity-100 translate-y-0";

  return (
    <Tag ref={ref} className={`${base} ${visible ? shown : ""} ${className}`}>
      {children}
    </Tag>
  );
};

export default RevealOnScroll;