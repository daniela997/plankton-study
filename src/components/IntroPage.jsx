import React from 'react';

const IntroPage = ({ onConsent, isChecked, setChecked }) => {
  return (
    <div className="intro-page">
      <div className="intro-card">
        <h1>Plankton Image Survey</h1>
        <p>
          You will be shown pairs of images of plankton captured with the Imaging FlowCytobot imaging system. 
          However, some of the images you will see are, in fact, <strong>synthetic</strong>! Your task is to select the one you think looks more realistic in each pair. Your responses will be used to evaluate the quality of the AI-generated plankton images.
        </p>
        <p>
          <strong>What we collect:</strong> your responses for each pair of images, as well as information about your familiarity with plankton imaging and/or machine learning. 
          <br />
          <strong>What we do not collect:</strong> any names, emails, or other personally identifiable information.
        </p>
        <p>The survey should take you at most 20 minutes. You can pause at any time and return using the same URL. Please proceed only if you agree to terms outlined above. 
            For any further questions regarding this study or the DEAL project, please contact <a href="mailto:daniela.ivanova@glasgow.ac.uk">Daniela Ivanova</a>.</p>
        
        <br />
        <strong>Thank you for helping us understand how AI generated plankton images are perceived!</strong>
        <br />
        
        <label className="consent-checkbox">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          I agree to the terms described above.
        </label>


        <button onClick={onConsent} disabled={!isChecked}>
          Start the survey
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
