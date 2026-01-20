import React from 'react';

const FamiliarityPage = ({ familiarity, setFamiliarity, onSubmit }) => {
  const handleChange = (field, value) => {
    setFamiliarity({ ...familiarity, [field]: Number(value) });
  };

  const isComplete =
    familiarity.planktonImaging >= 1 &&
    familiarity.planktonImaging <= 5 &&
    familiarity.mlExperience >= 1 &&
    familiarity.mlExperience <= 5;

  const renderScale = (field, label) => (
    <div className="familiarity-scale">
      <p>{label}</p>
      <div className="scale-options">
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={`${field}-${value}`}>
            <input
              type="radio"
              name={field}
              value={value}
              checked={familiarity[field] === value}
              onChange={(event) => handleChange(field, event.target.value)}
            />
            {value}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="intro-page">
      <div className="intro-card">
        <h2>Experience check</h2>
        <p>Please rate your expertise in the following areas on a scale from 1 (not familiar) to 5 (expert).</p>
        {renderScale('planktonImaging', '1. Plankton imaging (microscopy, IFCB or other imaging systems, taxonomic identification, etc.)')}
        {renderScale('mlExperience', '2. Machine learning / generative AI techniques')}

        <button onClick={onSubmit} disabled={!isComplete}>
          Start the survey
        </button>
      </div>
    </div>
  );
};

export default FamiliarityPage;
