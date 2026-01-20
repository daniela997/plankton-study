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
        </div>
      )}

      {loadingError[position] && (
        <div className="error-placeholder">
          <p className="error-details">{imageSrc.split('/').pop()}</p>
        </div>
      )}

      <img
        src={imageSrc}
        alt={`Plankton option ${subcategory}`}
        role="button"
        tabIndex={0}
        onClick={() => handleClick(position, subcategory)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick(position, subcategory);
          }
        }}
        onLoad={() => handleImageLoad(position)}
        onError={() => handleImageError(position)}
        className={getImageClassName(position)}
        style={{ display: loadingError[position] ? 'none' : 'block' }}
        aria-pressed={selected === position}
        aria-label={`Option ${subcategory} for category ${pair.categoryId}`}
      />

      {loaded[position] && !loadingError[position] && (
        <span className="sr-only">Subcategory {subcategory}</span>
      )}
    </div>
  );

  return (
    <div className="image-pair">
      <div className="pair-header">
        <h3>Category {pair.categoryId}</h3>
      </div>

      <div className="images-container" role="group" aria-label={`Image pair for category ${pair.categoryId}`}>
        {renderImage('left', pair.left, pair.leftSubcategory)}
        {renderImage('right', pair.right, pair.rightSubcategory)}
      </div>


      <div className="pair-info">
        <details className="sr-only">
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
