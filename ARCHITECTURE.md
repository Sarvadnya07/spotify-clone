# MusicStream Architecture Documentation

## System Overview

MusicStream is a full-stack music streaming application built with modern web technologies. It follows a client-server architecture with a REST API backend and a responsive web frontend that works on desktop, tablet, and mobile devices.

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Frontend)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HTML5 + CSS3 + Vanilla JavaScript (ES6+)           │   │
│  │  - Responsive UI with CSS Grid & Flexbox            │   │
│  │  - HTML5 Audio API for music playback                │   │
│  │  - LocalStorage for theme & token persistence       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ (HTTP/REST)
┌─────────────────────────────────────────────────────────────┐
│                  API Layer (Backend)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express.js Server (Node.js)                         │   │
│  │  - RESTful API endpoints                             │   │
│  │  - JWT authentication middleware                     │   │
│  │  - CORS support for cross-origin requests            │   │
│  │  - File upload handling with Multer                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ (SQL Queries)
┌─────────────────────────────────────────────────────────────┐
│                  Data Layer (Database)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SQLite3 Database                                    │   │
│  │  - Users table (authentication)                      │   │
│  │  - Songs table (music catalog)                       │   │
│  │  - Playlists & Playlist_Songs (user collections)    │   │
│  │  - Favorites (user preferences)                      │   │
│  │  - Listen_History (user activity)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ (File System)
┌─────────────────────────────────────────────────────────────┐
│                  Storage Layer (File System)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /uploads directory                                  │   │
│  │  - Audio files (.mp3, .wav, .ogg, .m4a)             │   │
│  │  - Organized by upload timestamp                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Structure

The frontend is organized into logical sections:

```
public/
├── index.html          # Main HTML structure
├── styles.css          # All styling (responsive, theme-aware)
└── app.js              # Application logic
    ├── State Management
    ├── Event Listeners
    ├── API Communication
    ├── UI Rendering
    └── Audio Playback Control
```

### State Management

The application uses a centralized state object that tracks:

```javascript
state = {
    user: { id, username },           // Current user
    token: string,                     // JWT authentication token
    currentSong: Song,                 // Currently playing song
    isPlaying: boolean,                // Playback status
    playlist: Song[],                  // Queue of songs
    currentIndex: number,              // Current position in queue
    repeatMode: 0|1|2,                 // Repeat settings
    isShuffle: boolean,                // Shuffle mode
    volume: 0-1,                       // Volume level
    currentPage: string,               // Active page
    allSongs: Song[],                  // All available songs
    userPlaylists: Playlist[],         // User's playlists
    favorites: Song[],                 // Favorite songs
    history: Song[],                   // Listen history
    genres: string[],                  // Available genres
    artists: string[],                 // Available artists
    currentPlaylist: Playlist|null     // Selected playlist
}
```

### Page Structure

The application has 5 main pages:

1. **Home Page**
   - Recent songs display
   - Personalized recommendations
   - Quick access to features

2. **Search Page**
   - Full-text search across songs
   - Filter by genre and artist
   - Real-time search results

3. **Playlists Page**
   - View all user playlists
   - Create new playlists
   - Manage playlist contents
   - Add/remove songs

4. **Favorites Page**
   - Display all favorite songs
   - Quick access to liked tracks
   - Toggle favorite status

5. **History Page**
   - Show recently played songs
   - Track listening patterns
   - Limited to last 50 plays

### Music Player Component

The music player is a persistent component at the bottom of the screen with:

- **Display Section**: Album art, song title, artist name
- **Control Section**: Play/pause, next, previous, repeat, shuffle
- **Progress Section**: Current time, progress bar, total duration
- **Volume Section**: Volume slider and control

### Theme System

The application supports dark and light themes using CSS variables:

```css
:root {
    --primary-color: #1DB954;      /* Spotify green */
    --secondary-color: #191414;    /* Dark background */
    --tertiary-color: #282828;     /* Card background */
    --text-primary: #FFFFFF;       /* Primary text */
    --text-secondary: #B3B3B3;     /* Secondary text */
    --border-color: #404040;       /* Borders */
}

body.light-theme {
    --primary-color: #1DB954;
    --secondary-color: #FFFFFF;
    --tertiary-color: #F5F5F5;
    --text-primary: #191414;
    --text-secondary: #666666;
    --border-color: #E0E0E0;
}
```

Theme preference is saved to localStorage and persists across sessions.

## Backend Architecture

### Express Server Structure

```
server.js
├── Middleware Setup
│   ├── CORS configuration
│   ├── JSON body parser
│   ├── Static file serving
│   └── File upload configuration
├── Database Initialization
│   └── SQLite connection and table creation
├── Authentication Routes
│   ├── POST /api/auth/register
│   └── POST /api/auth/login
├── Songs Routes
│   ├── GET /api/songs (with search/filter)
│   ├── GET /api/songs/:id
│   └── POST /api/songs/upload
├── Playlists Routes
│   ├── GET /api/playlists
│   ├── POST /api/playlists
│   ├── GET /api/playlists/:id/songs
│   ├── POST /api/playlists/:id/songs
│   └── DELETE /api/playlists/:playlistId/songs/:songId
├── Favorites Routes
│   ├── GET /api/favorites
│   ├── POST /api/favorites/:songId
│   └── DELETE /api/favorites/:songId
├── History Routes
│   ├── GET /api/history
│   └── POST /api/history/:songId
├── Discovery Routes
│   ├── GET /api/genres
│   ├── GET /api/artists
│   └── GET /api/recommendations
└── Server Startup
```

### Authentication Flow

```
User Input (Email, Password)
        ↓
Frontend: POST /api/auth/login
        ↓
Backend: Verify credentials
        ↓
Backend: Generate JWT token
        ↓
Frontend: Store token in localStorage
        ↓
Frontend: Add token to Authorization header for all requests
        ↓
Backend: Verify token middleware on protected routes
```

### Request/Response Cycle

```
Frontend                          Backend
   │                                │
   ├─ HTTP Request ────────────────→│
   │  (with JWT token)              │
   │                                │
   │                      ┌─────────┤
   │                      │ Verify  │
   │                      │ Token   │
   │                      └─────────┤
   │                                │
   │                      ┌─────────┤
   │                      │ Query   │
   │                      │ Database│
   │                      └─────────┤
   │                                │
   │←─── HTTP Response ────────────┤
   │  (JSON data)                   │
   │                                │
   ├─ Update State ────────────────→│
   │                                │
   ├─ Re-render UI ────────────────→│
   │                                │
```

## Database Schema

### Users Table
Stores user account information with hashed passwords.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**Indexes**: username, email (for fast lookups)

### Songs Table
Stores music metadata and file references.

```sql
CREATE TABLE songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    genre TEXT,
    duration INTEGER,
    file_path TEXT NOT NULL,
    cover_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**Indexes**: artist, genre (for filtering)

### Playlists Table
Stores user-created playlists.

```sql
CREATE TABLE playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### Playlist_Songs Junction Table
Links songs to playlists (many-to-many relationship).

```sql
CREATE TABLE playlist_songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
)
```

### Favorites Table
Stores user's favorite songs.

```sql
CREATE TABLE favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id),
    UNIQUE(user_id, song_id)
)
```

**Unique Constraint**: Prevents duplicate favorites

### Listen_History Table
Tracks user's listening activity.

```sql
CREATE TABLE listen_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
)
```

## Security Architecture

### Authentication & Authorization

1. **Password Security**
   - Passwords hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text
   - Compared using secure comparison

2. **JWT Tokens**
   - Issued on successful login/registration
   - Expire after 7 days
   - Stored in browser localStorage
   - Sent in Authorization header for protected routes

3. **Protected Routes**
   - Middleware verifies JWT on protected endpoints
   - Returns 401 if token is missing or invalid
   - Extracts userId from token for user-specific operations

### Input Validation

1. **Email Validation**
   - HTML5 email input type
   - Server-side format verification

2. **Password Requirements**
   - Minimum length enforced by frontend
   - Hashed before storage

3. **File Upload Validation**
   - MIME type checking (audio files only)
   - File size limit (100MB)
   - Filename sanitization

4. **SQL Injection Prevention**
   - Parameterized queries throughout
   - No string concatenation for SQL

### CORS Security

- Configured to allow requests from same origin
- Can be extended for specific domains in production
- Prevents unauthorized cross-origin requests

## Data Flow Examples

### User Registration Flow

```
1. User fills registration form
   ├─ username, email, password, confirmPassword
   └─ Client validates password match

2. Frontend sends POST /api/auth/register
   └─ { username, email, password }

3. Backend processes request
   ├─ Validates input
   ├─ Checks for duplicate username/email
   ├─ Hashes password with bcryptjs
   └─ Inserts user into database

4. Backend returns response
   ├─ JWT token
   ├─ User ID
   └─ Username

5. Frontend stores token
   ├─ localStorage.setItem('token', token)
   └─ localStorage.setItem('user', JSON.stringify(user))

6. Frontend shows main app
   └─ Loads initial data (songs, playlists, etc.)
```

### Music Playback Flow

```
1. User clicks "Play" on a song

2. Frontend updates state
   ├─ state.currentSong = song
   ├─ state.isPlaying = true
   └─ state.playlist = [song]

3. Frontend updates UI
   ├─ Updates player display (title, artist)
   ├─ Changes play button to pause icon
   └─ Loads audio file into Audio element

4. HTML5 Audio element plays
   ├─ Fires 'timeupdate' events
   ├─ Updates progress bar
   └─ Displays current time

5. When song ends
   ├─ Fires 'ended' event
   ├─ Moves to next song (if in queue)
   └─ Respects repeat/shuffle settings

6. Frontend records play
   └─ POST /api/history/:songId (async)
```

### Playlist Creation Flow

```
1. User enters playlist name and description

2. Frontend sends POST /api/playlists
   ├─ Authorization: Bearer {token}
   └─ { name, description }

3. Backend processes request
   ├─ Verifies JWT token
   ├─ Extracts userId from token
   ├─ Inserts playlist into database
   └─ Returns playlistId

4. Frontend receives response
   ├─ Clears input fields
   ├─ Reloads playlists list
   └─ Shows new playlist in UI

5. User can now add songs to playlist
   ├─ POST /api/playlists/:id/songs
   └─ { songId }
```

## Performance Considerations

### Frontend Optimization

1. **DOM Manipulation**
   - Batch updates where possible
   - Use innerHTML for large lists
   - Debounce search input

2. **Network Requests**
   - Lazy load data on page navigation
   - Cache API responses in state
   - Minimize payload sizes

3. **Audio Playback**
   - Use HTML5 Audio API (native, efficient)
   - Stream audio from file path
   - Manage memory for long sessions

### Backend Optimization

1. **Database Queries**
   - Use LIMIT clauses for pagination
   - Index frequently queried columns
   - Avoid N+1 queries

2. **File Handling**
   - Stream large files
   - Validate before processing
   - Clean up temporary files

3. **API Response**
   - Return only necessary fields
   - Compress JSON responses
   - Cache static assets

## Scalability Roadmap

### Short Term (Current)
- SQLite for single-server deployment
- File-based storage for uploads
- In-memory caching

### Medium Term
- PostgreSQL for multi-user scaling
- Redis for session/cache management
- S3 or similar for file storage

### Long Term
- Microservices architecture
- Elasticsearch for advanced search
- Message queues for async operations
- CDN for music delivery
- Kubernetes orchestration

## Technology Rationale

### Why Node.js + Express?
- JavaScript across full stack
- Non-blocking I/O for concurrent requests
- Rich ecosystem of packages
- Easy to learn and deploy

### Why SQLite?
- Zero configuration
- File-based, no server needed
- Sufficient for single-server deployment
- Easy to backup and migrate

### Why Vanilla JavaScript?
- No build step required
- Lightweight and fast
- Full control over code
- Good for learning and prototyping

### Why HTML5 Audio API?
- Native browser support
- No external dependencies
- Full playback control
- Works on all modern browsers

## Deployment Architecture

### Development
```
Local Machine
├── Node.js server (localhost:5000)
├── SQLite database (local file)
└── Frontend (served by Express)
```

### Production
```
Cloud Server (AWS/GCP/Azure)
├── Node.js server (with PM2/Docker)
├── PostgreSQL database
├── Redis cache
├── S3/Cloud Storage for files
└── CDN for static assets
```

## Monitoring & Logging

### Current Implementation
- Console logging for development
- Error handling on all routes
- Database error reporting

### Future Enhancements
- Structured logging (Winston/Morgan)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- User analytics
- Audit logs

## Conclusion

MusicStream demonstrates a modern, scalable architecture for a music streaming application. The separation of concerns between frontend, backend, and database allows for independent scaling and maintenance. The use of standard web technologies ensures compatibility and ease of deployment across various platforms.

