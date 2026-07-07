# Rabbit Hole Explorer

Rabbit Hole Explorer is a Chrome extension that helps you capture, organize, and revisit your browsing sessions ("rabbit holes").

Start a session from the popup, browse as usual, then stop recording to save a structured timeline of visited pages with metadata and tags.

---

## Features

- Record browsing activity during an active session
- Save sessions locally using Chrome Storage
- View saved sessions in a full-page React application
- Browse an overview of all sessions
- View your most recent session
- Browse previous sessions
- Edit session titles, tags, and details
- Export sessions as **JSON** or **TXT**
- Exclude websites using a configurable domain blacklist
- Detect inactivity with a **"Still down the rabbit hole?"** prompt
- Automatically save sessions after extended inactivity
- Sort, filter, and paginate saved sessions

---

## Tech Stack

- Chrome Extension (Manifest V3)
- React 18
- React Router
- ESBuild
- Jest

### Chrome APIs

- `storage`
- `history`
- `tabs`
- `alarms`
- `activeTab`

---

## Project Structure

```
├── popup/                 # Extension popup UI
├── background/            # Background service worker
├── content/               # Content scripts
├── app/                   # Full-page React application
├── session/               # Session processing pipeline
│   ├── History collection
│   ├── Blacklist filtering
│   ├── Metadata enrichment
│   └── Persistence
└── tests/                 # Jest tests
```

### Components

- **Popup UI**
  - Start/Stop recording
  - Session status
  - Live timer

- **Background Service Worker**
  - Session management
  - Auto-save
  - Stale session detection

- **Content Script**
  - Displays inactivity prompts

- **React Application**
  - Browse saved sessions
  - Edit metadata
  - Filter and search
  - Export sessions

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Build the extension

```bash
npm run build
```

### 3. Load into Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the project folder
5. After making changes:
   - Run the build command again
   - Click **Reload** on the extension

---

## Available Scripts

### Build everything

```bash
npm run build
```

### Individual builds

```bash
npm run build:index
```

Build the main React application.

```bash
npm run build:popup
```

Build the popup.

```bash
npm run build:history
```

Build the history/session utilities.

```bash
npm run build:background
```

Build the background service worker.

```bash
npm run build:content
```

Build the content script.

```bash
npm run build:session
```

Build shared session-processing utilities.

### Run tests

```bash
npm test
```

---

## User Flow

1. Open the extension popup.
2. Press **Start**.
3. Browse normally.
4. Watch the popup display:
   - Elapsed time
   - Number of pages visited
5. Press **Stop** when finished.
6. Open the full application to:
   - Review sessions
   - Edit details
   - Filter and search
   - Export
   - Delete sessions

---

## Settings

- Domain blacklist management
- Inactivity timeout configuration
- Accessibility page *(in progress)*
- Bug report page *(placeholder)*

---

## Privacy

- Session data is stored locally using Chrome Storage.
- Browsing history is only processed while a recording session is active.
- Blacklist filters are applied before sessions are saved.
- No backend or cloud service is required for core functionality.

---

## Testing

Current automated tests cover:

- Elapsed timer formatting
- Blacklist filtering
- Active/inactive blacklist rules
- `www` domain handling

Run the test suite with:

```bash
npm test
```

---

## Known Limitations

- Some settings pages are placeholders and are not yet fully implemented.
- Link sharing is currently experimental.
- Older or malformed session records may contain missing page arrays and require defensive rendering.

---

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Run the build.
4. Run the test suite.
5. Open a pull request with:
   - A clear summary
   - Testing notes
