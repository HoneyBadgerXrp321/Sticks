# Walking the Lore Path: A Badgers Trivia

An 8-bit style trivia game where a badger runs through different landscapes, collecting treasures and answering questions.

## Setup Instructions

### 1. Add Your Media Assets

Place your game assets in the following folder structure:

```
assets/
├── characters/
│   ├── 1.png          # Character frame 1
│   ├── 2.png          # Character frame 2  
│   ├── 3.png          # Character frame 3
│   ├── 4.png          # Character frame 4
│   └── 5.png          # Character frame 5
│
├── backgrounds/
│   ├── Sky_1.png      # Sky background 1
│   ├── Sky_2.png      # Sky background 2
│   ├── Sky_3.png      # Sky background 3
│   └── Sky_4.png      # Sky background 4
│
├── environment/
│   ├── floor.png      # Bridge/ground sprite
│   └── wave.png       # Water waves
│
├── chests/
│   ├── Closed_Chest.png    # Chest closed state
│   ├── Opening_Chest.png   # Chest opening animation
│   └── Opened_Chest.png    # Chest fully opened
│
└── ui/
    ├── question.png   # Question bar background
    └── end.png        # Castle end scene
```

### 2. Running the Game

1. **Local Server (Recommended):**
   - Open a terminal in the game folder
   - Run: `python -m http.server 8000` (Python 3) or `python -m SimpleHTTPServer 8000` (Python 2)
   - Open: `http://localhost:8000` in your browser

2. **VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

3. **Direct File Opening:**
   - Some browsers may block local file access
   - Use local server method instead

## Game Features

### Controls
- **RUN Button** or **Spacebar**: Start/stop character running
- **Mouse**: Click answer buttons during questions

### Gameplay
- Character animates through 5 frames while running
- Background scrolls (Sky 1-4 cycle) while bridge stays static
- Treasure chests appear and trigger trivia questions
- 3 lives, 50 questions total
- Questions appear with 8-bit typing animation
- 4 multiple choice answers per question

### Technical Features
- Pixel-perfect rendering (no anti-aliasing)
- Integer scaling for retro feel
- HTML5 Canvas with 800x480 resolution
- Responsive design with proper aspect ratio
- Frontend-only (no backend required)

## Game Flow

1. **Running State**: Character animates, background scrolls, chest approaches
2. **Question State**: Chest opens, question slides in with typing effect
3. **Answer State**: Show correct/incorrect feedback, deduct life if wrong
4. **Continue**: Move to next background and chest
5. **Game End**: After 50 questions or 0 lives, show final screen

## Asset Requirements

- **Character sprites**: 64x64 pixels recommended
- **Background skies**: 800x480 pixels (full screen)
- **Floor tiles**: Tileable horizontally
- **Chest sprites**: ~48x48 pixels
- **File format**: PNG with transparency support

## Customization

### Adding Your Own Questions
Edit `js/questionManager.js` and modify the `generateSampleQuestions()` function to include your trivia questions.

### Adjusting Game Settings
In `js/gameEngine.js`, you can modify:
- Character position
- Scroll speed
- Animation timing
- Lives count

### Styling
Edit `css/style.css` to customize:
- Button appearance
- Font sizes
- Color schemes
- Layout positioning

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Responsive design included

## Troubleshooting

**Missing Image Errors**: The game will show magenta placeholder rectangles for missing assets. Make sure all required images are in the correct folders.

**CORS Errors**: Use a local server instead of opening the HTML file directly.

**Performance Issues**: Ensure images are optimized and not too large. Recommended max size: 1MB per image.
