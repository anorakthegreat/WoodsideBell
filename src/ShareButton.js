import React from 'react';

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
    <button onClick={handleShare}>Share</button>
  );
};

export default ShareButton;