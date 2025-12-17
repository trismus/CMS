# MeinCMS

Ein modernes Content Management System gebaut mit React, Node.js und PostgreSQL.

## Features

- React Frontend mit Vite
- Express.js Backend mit TypeScript
- PostgreSQL Datenbank
- RESTful API
- Beiträge, Kategorien und Tags
- Benutzerverwaltung

## Technologie-Stack

### Frontend
- React 19
- React Router
- Axios für API-Aufrufe
- Vite als Build-Tool

### Backend
- Node.js mit Express
- TypeScript
- PostgreSQL
- CORS-Unterstützung

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
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

Die Datenbank-Migrationen werden automatisch beim Start ausgeführt.

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

## Projektstruktur

```
MeinCMS/
├── frontend/              # React Frontend
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend/              # Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── server.ts
│   │   └── db.ts
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   └── package.json
├── db/                   # PostgreSQL Daten (wird automatisch erstellt)
├── docker-compose.yml    # Docker Orchestrierung
├── package.json          # Root package.json
└── README.md
```

## Datenbankschema

### Tabellen:
- `users` - Benutzer
- `posts` - Beiträge
- `categories` - Kategorien
- `tags` - Tags
- `post_tags` - Verknüpfungstabelle für Posts und Tags

## Nächste Schritte

- [ ] Benutzer-Authentifizierung implementieren
- [ ] Admin-Dashboard erstellen
- [ ] Rich-Text-Editor für Beiträge
- [ ] Medien-Upload
- [ ] Suchfunktion
- [ ] Kommentar-System

## Lizenz

MIT
