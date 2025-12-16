import { useState, useEffect } from "react";

export function useScrollProgress(sectionId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // Calculate progress: 0 when section is entering viewport, 1 when leaving
      if (rect.top > windowHeight) {
        // Section is below viewport
        setProgress(0);
      } else if (rect.bottom < 0) {
        // Section is above viewport
        setProgress(1);
      } else {
        // Section is in viewport
        const visibleTop = Math.max(0, windowHeight - rect.top);
        const scrollableHeight = sectionHeight + windowHeight;
        const currentProgress = visibleTop / scrollableHeight;
        setProgress(Math.min(1, Math.max(0, currentProgress)));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionId]);

  return progress;
}
