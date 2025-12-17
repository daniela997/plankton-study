# Plankton Image Selection Survey

A React-based web application for collecting plankton image preferences through pairwise comparisons. Features anonymous session management, randomization, and resumable surveys.

## Features

- ✅ **Anonymous Sessions**: Participants can resume surveys without creating accounts
- ✅ **Randomization**: Category order and image pairs are randomized per participant
- ✅ **Resumable**: Surveys can be paused and resumed using URL-based session tracking
- ✅ **Firebase Integration**: Responses stored in Firestore database
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Progress Tracking**: Visual progress indicators
- ✅ **GitHub Pages Ready**: Easy deployment to GitHub Pages

## Project Structure

```
plankton-study/
├── public/
│   └── images/                 # Image assets (generated placeholders)
├── src/
│   ├── components/             # React components
│   │   ├── SurveyForm.jsx     # Main survey component
│   │   ├── ImagePair.jsx      # Image comparison component
│   │   └── ProgressBar.jsx    # Progress indicator
│   ├── data/
│   │   └── surveyConfig.js    # Survey configuration
│   ├── services/
│   │   └── database.js        # Firebase database functions
│   ├── utils/
│   │   └── surveyUtils.js     # Utility functions
│   ├── firebase.js            # Firebase configuration
│   ├── App.jsx                # Main app component
│   └── App.css               # Styles
├── generate_placeholders.sh   # Script to create placeholder images
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Register a web app and copy the config
5. Update `src/firebase.js` with your Firebase config

### 3. Generate Placeholder Images

```bash
./generate_placeholders.sh
```

### 4. Development

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

### 6. Deploy to GitHub Pages

1. Update `package.json` homepage field with your GitHub username:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/plankton-study"
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

## Usage

### For Participants

1. Visit the survey URL
2. Click on your preferred image in each pair
3. The survey automatically saves progress
4. Use the URL to resume later if needed

### For Researchers

1. Access Firebase Console to view responses
2. Use the database service functions to analyze data
3. Export responses programmatically

## Configuration

### Adding New Categories

Edit `src/data/surveyConfig.js`:

```javascript
export const surveyConfig = {
  categories: [
    {
      id: '001',
      name: 'New Category',
      subcategories: {
        A: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
        B: ['image4.jpg', 'image5.jpg', 'image6.jpg']
      }
    }
    // Add more categories...
  ]
};
```

### Image Organization

Place images in `public/images/{category_id}/subcategory_{A|B}/` following the naming convention used in the config.

## Firebase Security

The current rules allow all read/write operations. For production, consider these more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /survey_sessions/{sessionId} {
      allow read, write: if request.auth != null || true; // Adjust as needed
    }
  }
}
```

## Technical Details

- **Frontend**: React 19 with Vite
- **Database**: Firebase Firestore
- **Styling**: CSS with responsive design
- **Session Management**: URL-based with localStorage backup
- **Randomization**: Fisher-Yates shuffle algorithm
- **Deployment**: GitHub Pages with automatic builds

## Development Notes

- Images are preloaded for smooth transitions
- Session data includes timestamps for analysis
- Error handling for network issues and invalid sessions
- Mobile-optimized touch interactions

## Troubleshooting

### Firebase Connection Issues
- Check your Firebase config in `src/firebase.js`
- Ensure Firestore is enabled in Firebase Console
- Verify security rules allow your operations

### Image Loading Problems
- Ensure images are in the correct directory structure
- Check file paths in `surveyConfig.js`
- Verify images are accessible via the public URL

### Session Issues
- Clear localStorage: `localStorage.clear()`
- Check browser console for error messages
- Verify Firebase connection

## License

MIT License - feel free to use for research purposes.