import React, { useState, useEffect, useRef, useMemo } from "react";
import Slide from "../pages/home/Slide";
import type { Archetype } from "../../types";
import { optimizeImageUrl } from "../../utils/image/optimizeImageUrl";

interface SliderProps {
  array: Archetype[];
  slidesPerView?: number;
  autoplayDelay?: number;
}

const Slider: React.FC<SliderProps> = ({ array, slidesPerView = 1, autoplayDelay = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageVisible, setImageVisible] = useState(true);
  const [showText, setShowText] = useState(true);
  /** Slides dont l'image a déjà été demandée (actif + suivant préchargé). */
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() => new Set([0]));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const childrenArray = array || [];
  const totalSlides = childrenArray.length;

  const nextIndex = useMemo(() => {
    if (totalSlides === 0) return 0;
    return (currentIndex + slidesPerView) % totalSlides;
  }, [currentIndex, slidesPerView, totalSlides]);

  useEffect(() => {
    setLoadedIndices((prev) => {
      const merged = new Set(prev);
      merged.add(currentIndex);
      return merged;
    });

    // Précharge uniquement le slide suivant (hors DOM jusqu'à activation)
    const url = optimizeImageUrl(childrenArray[nextIndex]?.slider_img_url, "slider");
    if (!url || nextIndex === currentIndex) return;

    const img = new Image();
    img.onload = () => {
      setLoadedIndices((prev) => new Set(prev).add(nextIndex));
    };
    img.src = url;
  }, [currentIndex, nextIndex, childrenArray]);

  const goToNext = () => {
    setImageVisible(false);
    setShowText(false);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const next = prevIndex + slidesPerView;
        if (next >= totalSlides) {
          return 0;
        }
        return next;
      });

      setTimeout(() => {
        setImageVisible(true);

        setTimeout(() => {
          setShowText(true);
        }, 300);
      }, 50);
    }, 500);
  };

  const goToSlide = (slideIndex: number) => {
    setImageVisible(false);
    setShowText(false);

    setTimeout(() => {
      setCurrentIndex(slideIndex);

      setTimeout(() => {
        setImageVisible(true);

        setTimeout(() => {
          setShowText(true);
        }, 300);
      }, 50);
    }, 500);
  };

  useEffect(() => {
    if (!isPaused && totalSlides > slidesPerView) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, autoplayDelay);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPaused, currentIndex, totalSlides, slidesPerView, autoplayDelay]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (totalSlides === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full">
        {childrenArray.map((archetype, index) => {
          const isActive = index === currentIndex;
          const shouldLoad = isActive || loadedIndices.has(index);

          return (
            <div
              key={archetype.id ?? index}
              className={isActive ? "w-full" : "hidden"}
              aria-hidden={!isActive}
            >
              <Slide
                archetype={archetype}
                imageVisible={isActive ? imageVisible : false}
                showText={isActive ? showText : false}
                loadImage={shouldLoad}
                isActive={isActive}
              />
            </div>
          );
        })}
      </div>

      {totalSlides > slidesPerView && (
        <div className="md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          {Array.from({ length: Math.ceil(totalSlides / slidesPerView) }).map(
            (_, index) => {
              const slideIndex = index * slidesPerView;
              const isActive =
                currentIndex >= slideIndex &&
                currentIndex < slideIndex + slidesPerView;
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(slideIndex)}
                  className={`h-2 rounded-full transition-all mx-1 ${
                    isActive
                      ? "bg-white w-8"
                      : "bg-white bg-opacity-50 w-2 hover:bg-opacity-75"
                  }`}
                  aria-label={`Aller au slide ${index + 1}`}
                />
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default Slider;
