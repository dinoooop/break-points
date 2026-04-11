import React, { useEffect, useState } from "react";

interface Slide {
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: "/images/banner-1.jpg",
    title: "Quality Pre-Owned Vehicles, Unbeatable Prices",
    description: "Browse our extensive collection of carefully inspected used cars at prices you'll love.",
  },
  {
    image: "/images/banner-2.jpg",
    title: "Certified Pre-Owned Cars You Can Trust",
    description: "Every car in our inventory undergoes strict certification for your peace of mind.",
  },
  {
    image: "/images/banner-3.jpg",
    title: "Flexible Financing Made Simple",
    description: "Get approved in minutes with personalized payment plans that fit your budget.",
  }
];

const Banner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 1000 * 10); // change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;