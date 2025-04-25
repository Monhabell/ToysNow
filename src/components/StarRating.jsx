import React, { useState } from 'react';
import '../styles/StarRating.css';

const StarRating = ({ rating = 0, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(rating);

  const handleMouseEnter = (index) => setHovered(index + 1);
  const handleMouseLeave = () => setHovered(0);
  const handleClick = (index) => {
    const newRating = index + 1;
    setSelected(newRating);
    if (onRate) onRate(newRating); // Callback al padre
  };

  const displayRating = hovered || selected;

  return (
    <div className="stars" onMouseLeave={handleMouseLeave}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`star ${displayRating >= index + 1 ? 'full' : ''}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onClick={() => handleClick(index)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default StarRating;
