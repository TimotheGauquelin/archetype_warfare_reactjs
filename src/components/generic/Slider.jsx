import React, { useState, useEffect, useRef } from "react";
import Slide from "../pages/home/Slide";

const Slider = ({ array, slidesPerView = 1, autoplayDelay = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageVisible, setImageVisible] = useState(true);
  const [showText, setShowText] = useState(true);
  const intervalRef = useRef(null);
  const childrenArray = array || [];
  const totalSlides = childrenArray.length;

  const goToNext = () => {
    setImageVisible(false);
    setShowText(false);
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + slidesPerView;
        if (nextIndex >= totalSlides) {
          return 0;
        }
        return nextIndex;
      });
      
      setTimeout(() => {
        setImageVisible(true);
        
        setTimeout(() => {
          setShowText(true);
        }, 300);
      }, 50);
    }, 500);
  };

  const goToSlide = (slideIndex) => {
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

  const visibleSlides = childrenArray.slice(currentIndex, currentIndex + slidesPerView);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full">
        {visibleSlides.map((archetype, index) => (
          <div key={archetype.id || currentIndex + index} className="w-full">
            <Slide 
              archetype={archetype} 
              imageVisible={imageVisible}
              showText={showText}
            />
          </div>
        ))}
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
