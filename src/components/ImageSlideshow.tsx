import React, { useState, useEffect } from 'react';

interface ImageSlideshowProps {
  images: string[];
  interval?: number;
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ 
  images, 
  interval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, interval]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsTransitioning(false);
    }, 500); // Match this with the transition duration in CSS
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  // Preload images
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [images]);

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl bg-gray-100">
      {/* Current Slide */}
      <img 
        src={images[currentIndex]}
        alt="Cybersecurity program slide"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onError={(e) => {
          console.error('Slideshow image failed to load:', images[currentIndex]);
          (e.currentTarget as HTMLImageElement).style.opacity = '0.2';
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
          <div className="text-center p-4 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              {currentIndex === 0 ? 'Expert Cybersecurity Training' : 'State-of-the-Art Facilities'}
            </h3>
            <p className="text-sm md:text-base">
              {currentIndex === 0 
                ? 'Learn from industry professionals with real-world experience' 
                : 'Modern labs equipped with the latest technology'}
            </p>
          </div>
        </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;
