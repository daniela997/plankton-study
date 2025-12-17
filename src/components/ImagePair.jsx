import React, { useState, useEffect } from 'react';

const ImagePair = ({ pair, onSelect }) => {
  const [selected, setSelected] = useState(null);
  const [loaded, setLoaded] = useState({ left: false, right: false });
  const [loadingError, setLoadingError] = useState({ left: false, right: false });

  // Reset state when pair changes
  useEffect(() => {
    setSelected(null);
    setLoaded({ left: false, right: false });
    setLoadingError({ left: false, right: false });
  }, [pair.categoryId]);

  const handleImageLoad = (position) => {
    setLoaded(prev => ({ ...prev, [position]: true }));
    setLoadingError(prev => ({ ...prev, [position]: false }));
  };

  const handleImageError = (position) => {
    setLoaded(prev => ({ ...prev, [position]: true }));
    setLoadingError(prev => ({ ...prev, [position]: true }));
  };

  const handleClick = (position, subcategory) => {
    if (selected) return; // Prevent multiple selections

    setSelected(position);
    // Small delay to show selection feedback before calling onSelect
    setTimeout(() => {
      try {
        onSelect(subcategory); // Pass the actual subcategory (A or B), not position
      } catch (error) {
        console.error('Error in onSelect:', error);
        // Reset selection on error so user can try again
        setSelected(null);
      }
    }, 300);
  };

  const getImageClassName = (position) => {
    let classes = 'survey-image';

    if (!loaded[position]) {
      classes += ' loading';
    }

    if (selected === position) {
      classes += ' selected';
    } else if (selected && selected !== position) {
      classes += ' not-selected';
    }

    return classes;
  };

  const renderImage = (position, imageSrc, subcategory) => (
    <div className="image-container">
      {!loaded[position] && !loadingError[position] && (
        <div className="loading-placeholder">
          <div className="spinner"></div>
          <p>Loading image...</p>
        </div>
      )}

      {loadingError[position] && (
        <div className="error-placeholder">
          <p>⚠️ Image failed to load</p>
          <p className="error-details">{imageSrc.split('/').pop()}</p>
        </div>
      )}

      <img
        src={imageSrc}
        alt={`Plankton option ${subcategory}`}
        onClick={() => handleClick(position, subcategory)}
        onLoad={() => handleImageLoad(position)}
        onError={() => handleImageError(position)}
        className={getImageClassName(position)}
        style={{ display: loadingError[position] ? 'none' : 'block' }}
      />

      {loaded[position] && !loadingError[position] && (
        <div className="image-label">
          Option {subcategory}
        </div>
      )}
    </div>
  );

  return (
    <div className="image-pair">
      <div className="pair-header">
        <h3>Category {pair.categoryId}</h3>
        <p>Click on the image you prefer</p>
      </div>

      <div className="images-container">
        {renderImage('left', pair.left, pair.leftSubcategory)}

        <div className="vs-divider">
          <span className="vs-text">VS</span>
        </div>

        {renderImage('right', pair.right, pair.rightSubcategory)}
      </div>

      {selected && (
        <div className="selection-feedback">
          <p>You selected <strong>Option {selected === 'left' ? pair.leftSubcategory : pair.rightSubcategory}</strong></p>
          <p className="saving-indicator">Saving your response...</p>
        </div>
      )}

      <div className="pair-info">
        <details>
          <summary>Technical Details</summary>
          <div className="image-paths">
            <p><strong>Left (Subcategory {pair.leftSubcategory}):</strong> {pair.left}</p>
            <p><strong>Right (Subcategory {pair.rightSubcategory}):</strong> {pair.right}</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ImagePair;
