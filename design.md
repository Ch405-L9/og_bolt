# RSVP_ORP Reader - Mobile App Design

## Design Principles

This design follows **Apple Human Interface Guidelines (HIG)** to ensure the app feels like a first-party iOS application. All layouts are optimized for **mobile portrait orientation (9:16)** and **one-handed usage**.

---

## Screen List

### 1. **Home Screen (Library)**
The primary entry point displaying the user's reading library.

**Content & Functionality:**
- List of imported books/documents with cover images
- Search bar to filter library
- "Import" button (floating action button or bottom sheet trigger)
- "Settings" icon in top-right
- Empty state with onboarding prompt if no books exist

**Key User Flows:**
- User taps a book → Detail screen
- User taps "Import" → File picker → Import confirmation
- User taps "Settings" → Settings screen

---

### 2. **Reading Screen (RSVP Engine)**
The core RSVP reading experience where words are displayed one at a time.

**Content & Functionality:**
- Large, centered word display (ORP highlighted in red/accent color)
- Speed control slider (200-1000 WPM) at the bottom
- Play/Pause button
- Progress bar showing position in document
- Tap to pause/resume
- Swipe left/right to navigate chapters or sections
- Top bar with book title and exit button

**Key User Flows:**
- User adjusts speed → RSVP updates in real-time
- User pauses → Comprehension quiz option appears
- User completes reading → Progress saved automatically
- User exits → Returns to library with progress saved

---

### 3. **Book Detail Screen**
Shows metadata and options for a selected book.

**Content & Functionality:**
- Book cover image (large)
- Title, author, file type (EPUB/PDF/TXT)
- Reading progress bar
- "Start Reading" button
- "Bookmarks" button
- "Statistics" button
- "Delete" option (with confirmation)
- Reading mode selector (RSVP vs. Traditional)

**Key User Flows:**
- User taps "Start Reading" → Reading screen
- User taps "Bookmarks" → Bookmarks list
- User taps "Statistics" → Analytics dashboard

---

### 4. **Bookmarks Screen**
Displays all bookmarks for the current book.

**Content & Functionality:**
- List of bookmarks with timestamps and context snippets
- Tap to jump to that position in the book
- Swipe to delete bookmark
- Empty state if no bookmarks

**Key User Flows:**
- User taps bookmark → Returns to reading screen at that position
- User swipes to delete → Bookmark removed

---

### 5. **Analytics Dashboard**
Shows reading statistics and comprehension insights.

**Content & Functionality:**
- Total reading time for the book
- Average WPM achieved
- Comprehension score (if quizzes taken)
- Session history (date, duration, pages read)
- Chart showing reading speed trends
- Export option (optional)

**Key User Flows:**
- User views trends and insights
- User can filter by date range

---

### 6. **Settings Screen**
Configuration and preferences.

**Content & Functionality:**
- Dark mode toggle
- Text size adjustment slider
- ORP color picker (red, blue, green, etc.)
- Comprehension mode toggle (on/off)
- Privacy policy link
- About section
- Logout (if user auth is implemented)

**Key User Flows:**
- User adjusts settings → Changes apply immediately
- User enables dark mode → App theme switches

---

### 7. **Import/File Picker Screen**
Allows users to select and import files.

**Content & Functionality:**
- File browser showing device storage
- Filter by file type (EPUB, PDF, TXT)
- File size display
- "Import" button
- Cancel option

**Key User Flows:**
- User selects file → Confirmation dialog
- User confirms → File imported to library
- Import progress indicator for large files

---

### 8. **Comprehension Quiz Modal**
Optional pop-up during reading for comprehension checks.

**Content & Functionality:**
- Question about recently read content
- Multiple choice options
- Submit button
- Feedback (correct/incorrect)
- Option to continue reading

**Key User Flows:**
- Quiz appears after user pauses
- User answers → Feedback shown
- User taps "Continue" → Returns to reading

---

## Primary Content and Functionality

### RSVP Engine Core
- **Word Display**: One word at a time, centered on screen
- **ORP Highlighting**: Specific letter highlighted in accent color (default: red)
- **Speed Range**: 200 to 1000+ WPM
- **Controls**: Play/Pause, Speed slider, Progress bar
- **Pause Behavior**: Shows comprehension quiz option

### File Support
- **EPUB**: Parsed and flattened to word stream
- **PDF**: Text extracted while preserving flow
- **TXT**: Direct text parsing

### Library Management
- **Cover Images**: Displayed if available; custom cover upload option
- **Progress Tracking**: Percentage complete, last read position
- **Sorting**: By date added, alphabetical, or reading progress

### Adaptive Features
- **Dynamic Speed Adjustment**: Pop-up suggests speed changes based on comprehension
- **Comprehension Quizzes**: Optional pause-time quizzes
- **Dark Mode**: Full support with custom theme colors

---

## Key User Flows

### Flow 1: Import and Read a Book
1. User opens app → Library screen
2. User taps "Import" → File picker
3. User selects EPUB/PDF/TXT file
4. File imported → Added to library
5. User taps book → Detail screen
6. User taps "Start Reading" → Reading screen
7. RSVP engine displays words at selected WPM
8. User adjusts speed via slider
9. User pauses → Optional comprehension quiz
10. User exits → Progress saved

### Flow 2: Review Reading Statistics
1. User opens app → Library screen
2. User taps book → Detail screen
3. User taps "Statistics" → Analytics dashboard
4. User views reading time, WPM trends, comprehension score
5. User returns to library

### Flow 3: Customize Reading Experience
1. User opens app → Library screen
2. User taps "Settings" → Settings screen
3. User adjusts dark mode, text size, ORP color
4. Changes apply immediately
5. User returns to library

---

## Color Choices

### Brand Colors (BADGRTechnologies LLC)
- **Primary Blue**: `#0000FF` (brand accent)
- **Black**: `#000000` (text, dark mode background)
- **Gray**: `#808080` (secondary elements, borders)
- **White**: `#FFFFFF` (light mode background)

### Semantic Colors
- **Accent (ORP Highlight)**: `#FF0000` (red) for optimal recognition
- **Success**: `#22C55E` (green) for quiz feedback
- **Warning**: `#F59E0B` (amber) for alerts
- **Error**: `#EF4444` (red) for errors

### Dark Mode Palette
- **Background**: `#151718`
- **Surface**: `#1E2022`
- **Foreground**: `#ECEDEE`
- **Muted**: `#9BA1A6`

---

## Accessibility & Compliance

- **WCAG AA Compliance**: All colors meet contrast requirements
- **Text Scaling**: Supports system font size adjustments
- **High Contrast Mode**: Supported for users with visual impairments
- **Screen Reader Support**: All interactive elements properly labeled
- **Dark Mode**: Full support with automatic theme switching

---

## Navigation Architecture

```
Home (Library)
├── Book Detail
│   ├── Reading Screen (RSVP Engine)
│   ├── Bookmarks
│   └── Analytics Dashboard
├── Settings
└── Import/File Picker
```

All screens use tab-based or stack-based navigation with proper back button handling.
