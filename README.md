# MeinCMS 🚀

Ein modernes, professionelles Content Management System gebaut mit React, Node.js und PostgreSQL. Vollständig containerisiert mit Docker für einfache Entwicklung und Deployment.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## ✨ Features

### Frontend
- 🎨 **Moderne Landingpage** mit Hero, Tech Stack, Feature-Showcases und Footer
- 🔐 **Authentifizierung** mit Quick-Login für Demo-Accounts
- 📊 **Admin-Dashboard** mit Statistiken und Schnellzugriff
- 📝 **Post-Management** - Vollständiges CRUD mit Modal-Editor
- 📁 **Kategorie-Verwaltung** - Organisiere Inhalte mit Icons
- 👥 **User-Management** - Benutzer mit Rollen und Status verwalten
- 🎯 **Sidebar-Navigation** für intuitive Admin-Bedienung
- 📱 **Responsive Design** für alle Bildschirmgrößen

### Backend
- 🔒 **JWT-Authentifizierung** mit sicheren Tokens
- 👑 **4 Benutzerrollen** (Admin, Operator, User, Guest)
- 📧 **Email-Verifizierung** mit automatischen Emails
- 🔑 **Passwort-Reset** Funktion
- 📬 **MailHog Integration** für Email-Testing
- 🛡️ **Rollenbasierte Zugriffskontrolle** (RBAC)
- 🗄️ **PostgreSQL** mit automatischen Migrationen
- 📊 **Admin-API** für Dashboard-Statistiken

## 🛠️ Technologie-Stack

### Frontend
- ⚛️ **React 19** - Moderne UI-Bibliothek
- 📘 **TypeScript** - Type-Safety
- 🚀 **Vite** - Schnelles Build-Tool
- 🔀 **React Router** - Client-side Routing
- 📡 **Axios** - HTTP Client

### Backend
- 🟢 **Node.js 20** - Runtime Environment
- ⚡ **Express.js** - Web Framework
- 📘 **TypeScript** - Type-Safety
- 🐘 **PostgreSQL 16** - Relationale Datenbank
- 🔐 **JWT** - Token-basierte Authentifizierung
- 🔒 **bcrypt** - Passwort-Hashing
- 📧 **Nodemailer** - Email-Versand

### DevOps
- 🐳 **Docker** - Containerisierung
- 🎼 **Docker Compose** - Multi-Container Orchestrierung
- 📬 **MailHog** - SMTP Testing Server

## Installation

### Option 1: Docker Setup (Empfohlen)

#### Voraussetzungen
- Docker Desktop installiert
- Docker Compose verfügbar

#### Quick Start

Alle Services (Frontend, Backend, PostgreSQL) mit einem Befehl starten:

```bash
docker-compose up --build
```

Die Applikation ist dann verfügbar unter:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MailHog Web UI**: http://localhost:8025 (Email Testing)
- **PostgreSQL**: localhost:5432

Die Datenbank-Migrationen und Test-Benutzer werden automatisch beim Start erstellt.

**Datenbankpersistenz:** Die PostgreSQL-Daten werden im lokalen `./db` Ordner gespeichert und bleiben auch nach dem Stoppen der Container erhalten.

#### Services verwalten

```bash
# Services im Hintergrund starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Bestimmten Service neu starten
docker-compose restart backend

# Services stoppen
docker-compose down

# Datenbank komplett zurücksetzen (löscht den ./db Ordner!)
docker-compose down
rm -rf db
```

### Option 2: Manuelle Installation

#### Voraussetzungen
- Node.js (v18 oder höher)
- PostgreSQL (v14 oder höher)
- npm oder yarn

#### Setup

1. Dependencies installieren:
```bash
npm install
```

2. PostgreSQL Datenbank erstellen:
```bash
createdb meincms
```

3. Backend Umgebungsvariablen konfigurieren:
```bash
cp backend/.env.example backend/.env
```

Bearbeite `backend/.env` und setze deine Datenbankzugangsdaten.

4. Datenbank-Migrationen ausführen:
```bash
npm run migrate --workspace=backend
```

5. Frontend und Backend Dependencies installieren:
```bash
npm install --workspace=frontend
npm install --workspace=backend
```

#### Entwicklung

Beide Server gleichzeitig starten:
```bash
npm run dev
```

Nur Frontend starten:
```bash
npm run dev:frontend
```

Nur Backend starten:
```bash
npm run dev:backend
```

## API Endpunkte

### Health Check
- `GET /api/health` - Prüft ob die API läuft

### Authentifizierung

#### Registrierung
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "user"  // optional: "admin", "operator", "user", "guest" (default: "guest")
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Antwort:
```json
{
  "message": "Login successful",
  "token": "jwt-token-hier",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

#### Profil abrufen (geschützt)
```bash
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Benutzerrollen

Das System unterstützt vier verschiedene Benutzerrollen mit hierarchischer Struktur:

1. **Admin** (höchste Berechtigung)
   - Vollständiger Zugriff auf alle Funktionen
   - Kann alle Inhalte verwalten
   - Kann andere Benutzer verwalten

2. **Operator**
   - Kann Inhalte erstellen und verwalten
   - Eingeschränkte Administrationsrechte

3. **User**
   - Kann eigene Beiträge erstellen
   - Kann eigene Inhalte verwalten

4. **Guest** (niedrigste Berechtigung)
   - Nur Lesezugriff
   - Kann keine Inhalte erstellen

### Test-Benutzer

Bei Docker-Start werden automatisch vier Test-Benutzer erstellt:

| Rolle     | Email                      | Passwort     |
|-----------|----------------------------|--------------|
| Admin     | admin@meincms.local        | admin123     |
| Operator  | operator@meincms.local     | operator123  |
| User      | user@meincms.local         | user123      |
| Guest     | guest@meincms.local        | guest123     |

### Posts

- `GET /api/posts` - Alle veröffentlichten Beiträge (öffentlich)
- `GET /api/posts/:slug` - Einzelnen Beitrag nach Slug (öffentlich)
- `POST /api/posts` - Neuen Beitrag erstellen (benötigt mindestens "user" Rolle)
  ```bash
  POST /api/posts
  Authorization: Bearer <jwt-token>
  Content-Type: application/json

  {
    "title": "Mein Beitrag",
    "slug": "mein-beitrag",
    "content": "Inhalt des Beitrags",
    "excerpt": "Kurze Zusammenfassung",
    "category_id": 1,
    "status": "published"
  }
  ```

## 📂 Projektstruktur

```
MeinCMS/
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/           # React Komponenten
│   │   │   ├── AdminLayout.tsx   # Admin Layout Wrapper
│   │   │   ├── AdminSidebar.tsx  # Admin Navigation
│   │   │   ├── LoginWidget.tsx   # Login Formular
│   │   │   └── Navbar.tsx        # Hauptnavigation
│   │   ├── context/              # React Context
│   │   │   └── AuthContext.tsx   # Authentication State
│   │   ├── pages/                # Seiten-Komponenten
│   │   │   ├── Home.tsx          # Landingpage
│   │   │   ├── Dashboard.tsx     # Admin Dashboard
│   │   │   ├── AdminPosts.tsx    # Post-Management
│   │   │   ├── AdminCategories.tsx # Kategorie-Management
│   │   │   ├── AdminUsers.tsx    # User-Management
│   │   │   └── Login.tsx         # Login-Seite
│   │   ├── services/             # API Services
│   │   │   └── api.ts            # Axios API Client
│   │   ├── App.tsx               # Haupt-App mit Routing
│   │   ├── main.tsx              # Entry Point
│   │   └── index.css             # Global Styles
│   ├── Dockerfile
│   ├── index.html
│   └── package.json
│
├── backend/                       # Express Backend
│   ├── src/
│   │   ├── controllers/          # Route Handler
│   │   │   ├── authController.ts     # Auth Logik
│   │   │   ├── emailController.ts    # Email Funktionen
│   │   │   ├── adminController.ts    # Admin API
│   │   │   └── postsController.ts    # Posts CRUD
│   │   ├── middleware/           # Express Middleware
│   │   │   └── auth.ts           # JWT Verification & RBAC
│   │   ├── routes/               # API Routes
│   │   │   ├── auth.ts           # Auth Endpoints
│   │   │   ├── admin.ts          # Admin Endpoints
│   │   │   └── posts.ts          # Posts Endpoints
│   │   ├── services/             # Business Logic
│   │   │   └── emailService.ts   # Email-Versand
│   │   ├── migrations/           # Datenbank Migrationen
│   │   │   ├── migrate.ts        # Migration Runner
│   │   │   ├── seed.ts           # Test-Daten
│   │   │   └── 001_complete_schema.sql
│   │   ├── server.ts             # Express Server
│   │   └── db.ts                 # PostgreSQL Client
│   ├── Dockerfile
│   ├── docker-entrypoint.sh      # Startup Script
│   ├── .env.example              # Env Template
│   └── package.json
│
├── db/                            # PostgreSQL Daten (automatisch)
├── docker-compose.yml             # Multi-Container Setup
├── package.json                   # Root Dependencies
├── README.md                      # Diese Datei
├── AUTH.md                        # Auth Dokumentation
└── FEATURES.md                    # Feature-Liste
```

## Datenbankschema

### Tabellen:
- `users` - Benutzer
- `posts` - Beiträge
- `categories` - Kategorien
- `tags` - Tags
- `post_tags` - Verknüpfungstabelle für Posts und Tags

## 🎯 Admin-Bereich

Nach dem Login als Admin hast du Zugriff auf folgende Bereiche:

### Dashboard (`/admin`)
- **Statistik-Karten**: Benutzer, Posts, Kategorien
- **Schnellzugriff**: Direkte Links zu allen Admin-Bereichen
- **Übersicht**: Aktuelle Systemzahlen auf einen Blick

### Post-Management (`/admin/posts`)
- **Erstellen**: Neue Posts mit Titel, Inhalt, Kategorie
- **Bearbeiten**: Bestehende Posts ändern
- **Löschen**: Posts entfernen
- **Status**: Draft/Published Workflow
- **Grid-Ansicht**: Übersichtliche Kartendarstellung

### Kategorie-Verwaltung (`/admin/categories`)
- **Erstellen**: Neue Kategorien mit Icons
- **Slug-Generator**: Automatische URL-freundliche Namen
- **Beschreibungen**: Detaillierte Kategorie-Infos
- **Post-Zähler**: Anzahl der Posts pro Kategorie

### User-Management (`/admin/users`)
- **Übersicht**: Alle registrierten Benutzer
- **Suche**: Filtere nach Username oder Email
- **Rollen**: Admin, Operator, User, Guest
- **Status**: Aktiv, Verifiziert
- **Löschen**: Benutzer entfernen (nicht sich selbst)

## 📧 Email-System

### MailHog
Alle Emails werden von MailHog abgefangen und können unter http://localhost:8025 eingesehen werden:
- Email-Verifizierung
- Passwort-Reset
- Willkommens-Emails

### Email-Funktionen
```bash
# Email-Verifizierung anfordern
POST /api/auth/request-verification
Authorization: Bearer <token>

# Email verifizieren
POST /api/auth/verify-email
{
  "token": "verification-token"
}

# Passwort-Reset anfordern
POST /api/auth/request-password-reset
{
  "email": "user@example.com"
}

# Passwort zurücksetzen
POST /api/auth/reset-password
{
  "token": "reset-token",
  "newPassword": "neuesPasswort123"
}
```

## 🎨 Screenshots

### Startseite
- Hero-Sektion mit Feature-Cards
- Tech Stack Übersicht
- Feature-Previews mit Dashboard und Editor
- Test-Accounts Showcase
- Call-to-Action und Footer

### Admin-Dashboard
- Moderne Sidebar-Navigation
- Statistik-Cards mit Icons
- Schnellzugriff-Buttons
- Responsive für alle Geräte

### Content-Management
- Post-Editor mit Modal
- Kategorie-Verwaltung
- User-Tabelle mit Suche

## 🔐 Sicherheit

- **JWT Tokens**: Sichere Authentifizierung
- **bcrypt Hashing**: Passwörter werden gehasht gespeichert
- **RBAC**: Rollenbasierte Zugriffskontrolle
- **Protected Routes**: Frontend-Routing-Schutz
- **API Middleware**: Backend-Endpunkt-Schutz
- **Token Expiration**: Automatische Token-Ablauf

## 📚 Weitere Dokumentation

- **[AUTH.md](./AUTH.md)** - Detaillierte Authentifizierungs-Dokumentation
- **[FEATURES.md](./FEATURES.md)** - Vollständige Feature-Liste und Status

## 🚀 Nächste Schritte

- [x] Benutzer-Authentifizierung ✅
- [x] Admin-Dashboard ✅
- [x] Email-Verifizierung ✅
- [x] Passwort-Reset ✅
- [x] Post-Management ✅
- [x] Kategorie-Verwaltung ✅
- [ ] Rich-Text-Editor (WYSIWYG)
- [ ] Medien-Upload und -Verwaltung
- [ ] Erweiterte Suchfunktion
- [ ] Kommentar-System
- [ ] SEO-Optimierung
- [ ] Performance-Monitoring

## 🤝 Beiträge

Contributions sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

## 📝 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

---

**Entwickelt mit ❤️ und [Claude Code](https://claude.com/claude-code)**
