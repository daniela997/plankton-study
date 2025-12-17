import { surveyConfig } from '../data/surveyConfig';

// Fisher-Yates shuffle algorithm for randomizing arrays
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate shuffled category order for a participant
export const generateShuffledCategories = () => {
  const categoryIds = surveyConfig.categories.map(cat => cat.id);
  return shuffleArray(categoryIds);
};

// Get random item from array
export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate random pair for a specific category
export const generatePairForCategory = (categoryId) => {
  const category = surveyConfig.categories.find(c => c.id === categoryId);
  if (!category) {
    throw new Error(`Category ${categoryId} not found`);
  }

  const imageA = getRandomItem(category.subcategories.A);
  const imageB = getRandomItem(category.subcategories.B);

  const imageAPath = `/images/${categoryId}/subcategory_A/${imageA}`;
  const imageBPath = `/images/${categoryId}/subcategory_B/${imageB}`;

  // Randomly decide which subcategory goes on left vs right
  const swapOrder = Math.random() < 0.5;

  return {
    left: swapOrder ? imageBPath : imageAPath,
    right: swapOrder ? imageAPath : imageBPath,
    leftSubcategory: swapOrder ? 'B' : 'A',
    rightSubcategory: swapOrder ? 'A' : 'B',
    // Keep original format for backward compatibility
    A: imageAPath,
    B: imageBPath
  };
};

// Generate unique session ID
export const generateSessionId = () => {
  return crypto.randomUUID();
};

// Validate session data structure
export const validateSession = (session) => {
  return session &&
    session.participantId &&
    Array.isArray(session.shuffledCategories) &&
    typeof session.responses === 'object' &&
    typeof session.currentIndex === 'number';
};
