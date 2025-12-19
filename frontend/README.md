# Base Frontend

Das Frontend von Base - eine moderne React-Anwendung mit TypeScript und Vite.

## 🛠️ Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **React Router** - Client-side Routing
- **Axios** - HTTP Client
- **Context API** - State Management

## 📁 Struktur

```
src/
├── components/          # Wiederverwendbare Komponenten
│   ├── AdminLayout.tsx  # Admin Layout mit Sidebar
│   ├── AdminSidebar.tsx # Navigation für Admin-Bereich
│   ├── LoginWidget.tsx  # Login-Formular Widget
│   └── Navbar.tsx       # Hauptnavigation
│
├── context/             # React Context
│   └── AuthContext.tsx  # Authentication State & Functions
│
├── pages/               # Seiten-Komponenten
│   ├── Home.tsx         # Landingpage
│   ├── Dashboard.tsx    # Admin Dashboard
│   ├── AdminPosts.tsx   # Post-Management
│   ├── AdminCategories.tsx # Kategorie-Management
│   ├── AdminUsers.tsx   # User-Management
│   └── Login.tsx        # Login-Seite
│
├── services/            # API Services
│   └── api.ts          # Axios Client & API Functions
│
├── App.tsx             # Haupt-App mit Routing
├── main.tsx            # Entry Point
└── index.css           # Global Styles
```

## 🎨 Seiten

### Öffentliche Seiten
- **Home (`/`)** - Landingpage mit Features und Login-Widget
- **Login (`/login`)** - Dedizierte Login-Seite

### Admin-Bereich (Protected)
- **Dashboard (`/admin`)** - Statistiken und Schnellzugriff
- **Posts (`/admin/posts`)** - Post-Verwaltung mit CRUD
- **Kategorien (`/admin/categories`)** - Kategorie-Management
- **Benutzer (`/admin/users`)** - User-Management

## 🔐 Authentifizierung

Der `AuthContext` verwaltet den globalen Authentifizierungs-Status:

```typescript
const { user, token, login, logout, isAuthenticated, isAdmin } = useAuth();
```

**Features:**
- JWT Token Storage (localStorage)
- Automatische Token-Injection in API Calls
- Protected Routes
- Role-based Access Control

## 🎯 Komponenten

### AdminLayout
Wrapper für Admin-Seiten mit Navbar und Sidebar.

### AdminSidebar
Navigation mit Menü-Sektionen:
- Übersicht (Dashboard)
- Content (Posts, Kategorien)
- Verwaltung (Benutzer)
- System (Einstellungen)

### LoginWidget
Login-Formular mit:
- Email/Password Inputs
- Quick-Login Buttons für Demo-Accounts
- Error Handling

### Navbar
Hauptnavigation mit:
- Logo
- User Info (wenn eingeloggt)
- Logout Button

## 🎨 Styling

- **CSS Variables** für konsistente Farben
- **Gradient Backgrounds** für moderne Optik
- **Card-based Layouts** für Content
- **Responsive Design** mit Media Queries
- **Hover Effects** und Transitions

### CSS Custom Properties
```css
--primary-color: #4CAF50
--secondary-color: #2196F3
--danger-color: #f44336
--dark-color: #1a1a2e
--light-color: #f5f5f5
```

## 🔌 API Integration

Der API-Client in `services/api.ts` bietet:

```typescript
// Auth API
authAPI.login(email, password)
authAPI.register(username, email, password, role)
authAPI.getProfile()

// Admin API
adminAPI.getStats()
adminAPI.getUsers(params)
adminAPI.deleteUser(id)

// Posts API
postsAPI.getPosts()
postsAPI.getPost(slug)
postsAPI.createPost(data)
```

**Features:**
- Automatische Bearer Token Injection
- 401 Error Handling (Logout)
- Base URL Configuration
- TypeScript Types

## 🚀 Development

### Installation
```bash
npm install
```

### Dev Server starten
```bash
npm run dev
```

Server läuft auf: http://localhost:5173

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📝 TypeScript

Alle Komponenten sind in TypeScript geschrieben für:
- Type Safety
- IntelliSense
- Better Developer Experience
- Weniger Runtime Errors

## 🔧 Vite Configuration

- **HMR** (Hot Module Replacement) aktiviert
- **React Fast Refresh** für schnelle Updates
- **TypeScript** Support out-of-the-box
- **Environment Variables** via `import.meta.env`

## 📦 Dependencies

### Production
- `react` & `react-dom` - UI Library
- `react-router-dom` - Routing
- `axios` - HTTP Client

### Development
- `@vitejs/plugin-react` - Vite React Plugin
- `typescript` - Type Checking
- `eslint` - Code Linting

## 🎯 Best Practices

- **TypeScript** für alle Komponenten
- **Functional Components** mit Hooks
- **Context API** für Global State
- **Custom Hooks** für wiederverwendbare Logik
- **CSS Modules** oder CSS-in-JS vermeiden (Global CSS)
- **Protected Routes** für Admin-Bereich

## 📚 Weitere Infos

- Siehe [Haupt-README](../README.md) für komplette Dokumentation
- [AUTH.md](../AUTH.md) für Authentifizierungs-Details
- [FEATURES.md](../FEATURES.md) für Feature-Liste
