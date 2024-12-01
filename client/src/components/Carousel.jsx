import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideContainerRef = useRef(null);
  const touchStartRef = useRef(null);
  const autoPlayRef = useRef(null);

  const slides = [
    {
      id: 0,
      desktopImage: "https://thecambridgeshop.com/cdn/shop/files/WINTER-MAINN_8e0ab99a-329d-4ba5-bec3-60ceb86fb149.webp?v=17296028532000",
      mobileImage: "https://thecambridgeshop.com/cdn/shop/files/WINTERRR_754b1c06-739b-464e-9e55-833ad0afa0de.webp?v=17296028541500",
    },
    {
      id: 1,
      desktopImage: "https://zeenwoman.com/cdn/shop/files/Sweaters_ebc7d83c-cf8a-4066-ab4e-3ca3cdffb525.webp?v=1729250677",
      mobileImage: "https://zeenwoman.com/cdn/shop/files/west-mobile_copy1.webp?v=17292551901500",
    },
    {
      id: 2,
      desktopImage: "https://zeenwoman.com/cdn/shop/files/west1.webp?v=17292551891500",
      mobileImage: "https://thecambridgeshop.com/cdn/shop/files/Sweaterss_30f0d3fa-ca57-4947-baae-8a30bb85d026.webp?v=17296032501500",
    },
    {
      id: 3,
      desktopImage: "https://thecambridgeshop.com/cdn/shop/files/Main-Sweaterss_265c2895-4d2f-4923-8602-fae5daec3e75.webp?v=17296032482000",
      mobileImage: "https://thecambridgeshop.com/cdn/shop/files/Summer_II.png?v=17255206381500",
    }
  ];

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleTouchStart = useCallback((e) => {
    // Stop auto-play
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    // Record touch start details
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchStartRef.current) return;

    const currentTouch = e.touches[0];
    const deltaX = currentTouch.clientX - touchStartRef.current.x;
    const deltaY = currentTouch.clientY - touchStartRef.current.y;

    // Prevent vertical scrolling if horizontal swipe is more pronounced
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartRef.current) return;

    const currentTouch = e.changedTouches[0];
    const deltaX = currentTouch.clientX - touchStartRef.current.x;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Calculate swipe velocity
    const velocity = Math.abs(deltaX) / deltaTime;

    // More sophisticated swipe detection
    if (Math.abs(deltaX) > 50 || velocity > 0.3) {
      if (deltaX < 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }

    // Reset touch state
    touchStartRef.current = null;

    // Restart auto-play
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(handleNextSlide, 3500);
  }, [handleNextSlide, handlePrevSlide]);

  // Auto-play management
  useEffect(() => {
    autoPlayRef.current = setInterval(handleNextSlide, 3500);
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [handleNextSlide]);

  // Improved slide positioning logic with smoother transitions
  const getSlideStyle = useCallback((index) => {
    const slidesCount = slides.length;
    let offset = index - currentSlide;

    // Advanced wraparound logic to ensure smooth transitions
    if (offset > slidesCount / 2) offset -= slidesCount;
    if (offset < -slidesCount / 2) offset += slidesCount;

    // Refine opacity and transform for smoother visual effect
    const absoluteOffset = Math.abs(offset);
    const opacity = absoluteOffset <= 1 
      ? 1 - Math.min(absoluteOffset, 1) 
      : 0;

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      transform: `translateX(${offset * 100}%)`,
      transition: 'transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.5s ease-in-out',
      opacity: opacity,
      zIndex: absoluteOffset <= 1 ? 10 : 1,
      pointerEvents: absoluteOffset <= 1 ? 'auto' : 'none',
      willChange: 'transform, opacity'
    };
  }, [currentSlide, slides.length]);

  return (
    <div
      ref={slideContainerRef}
      className="relative w-full h-[75vh] overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        touchAction: 'pan-y pinch-zoom',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {slides.map((slide, idx) => (
        <div 
          key={slide.id} 
          style={getSlideStyle(idx)}
        >
          <picture>
            <source srcSet={slide.mobileImage} media="(max-width: 768px)" />
            <img
              src={slide.desktopImage}
              alt={`Slide ${slide.id}`}
              className="w-full h-full object-cover"
              draggable="false"
              loading="lazy"
              fetchPriority="high"
              style={{ 
                pointerEvents: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            />
          </picture>
        </div>
      ))}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentSlide(idx);
              // Reset auto-play
              if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
              }
              autoPlayRef.current = setInterval(handleNextSlide, 3500);
            }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              idx === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;