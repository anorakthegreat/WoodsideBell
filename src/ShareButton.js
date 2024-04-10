import React from 'react';
import './ShareButton.css'; // Import the CSS file for styling

const ShareButton = ({ url, title }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log("Web Share API not supported");
    }
  };

  return (
    <button className="share-button" onClick={handleShare}>
      <span className="icon">Share Me!</span>
    </button>
  );
};

export default ShareButton;