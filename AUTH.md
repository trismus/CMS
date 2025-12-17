# Authentifizierung & Autorisierung - MeinCMS

## Übersicht

MeinCMS verwendet JWT (JSON Web Tokens) für die Authentifizierung und ein rollenbasiertes Zugriffskontrollsystem (RBAC) mit vier Benutzerrollen.

## Benutzerrollen

### Rollenhierarchie

```
Admin > Operator > User > Guest
```

### Rollen im Detail

#### 1. Admin
- **Berechtigungen**: Vollständiger Zugriff auf alle Funktionen
- **Kann**:
  - Alle Inhalte erstellen, bearbeiten und löschen
  - Benutzer verwalten
  - Systemeinstellungen ändern
  - Alle administrativen Aufgaben durchführen

#### 2. Operator
- **Berechtigungen**: Erweiterte Content-Management-Rechte
- **Kann**:
  - Inhalte erstellen, bearbeiten und veröffentlichen
  - Kategorien und Tags verwalten
  - Kommentare moderieren
- **Kann nicht**:
  - Benutzer verwalten
  - Systemeinstellungen ändern

#### 3. User
- **Berechtigungen**: Standard-Benutzer
- **Kann**:
  - Eigene Beiträge erstellen und bearbeiten
  - Kommentare schreiben
  - Profil verwalten
- **Kann nicht**:
  - Fremde Beiträge bearbeiten
  - Administrative Aufgaben durchführen

#### 4. Guest
- **Berechtigungen**: Minimale Rechte
- **Kann**:
  - Öffentliche Inhalte lesen
  - Profil ansehen
- **Kann nicht**:
  - Inhalte erstellen
  - Kommentare schreiben (standardmäßig)

## API Authentifizierung

### 1. Registrierung

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "username": "maxmustermann",
  "email": "max@example.com",
  "password": "SecurePassword123!",
  "role": "user"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "username": "maxmustermann",
    "email": "max@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-12-17T10:30:00.000Z"
  }
}
```

**Fehler**:
- `400`: Fehlende oder ungültige Daten
- `409`: Benutzer existiert bereits

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "max@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "username": "maxmustermann",
    "email": "max@example.com",
    "role": "user"
  }
}
```

**Fehler**:
- `400`: Email oder Passwort fehlt
- `401`: Ungültige Anmeldedaten
- `403`: Account ist deaktiviert

### 3. Profil abrufen

**Endpoint**: `GET /api/auth/profile`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 5,
    "username": "maxmustermann",
    "email": "max@example.com",
    "role": "user",
    "isActive": true,
    "lastLogin": "2025-12-17T10:35:00.000Z",
    "createdAt": "2025-12-17T10:30:00.000Z",
    "updatedAt": "2025-12-17T10:35:00.000Z"
  }
}
```

**Fehler**:
- `401`: Nicht authentifiziert / ungültiger Token
- `404`: Benutzer nicht gefunden

## Geschützte Endpunkte verwenden

### Authorization Header

Für alle geschützten Endpunkte muss der JWT-Token im Authorization-Header gesendet werden:

```
Authorization: Bearer <your-jwt-token>
```

### Beispiel mit curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@meincms.local","password":"admin123"}'

# Response speichern und Token extrahieren
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Geschützten Endpunkt aufrufen
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mein Beitrag",
    "slug": "mein-beitrag",
    "content": "Inhalt",
    "status": "published"
  }'
```

### Beispiel mit JavaScript (fetch)

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@meincms.local',
    password: 'admin123'
  })
});

const { token } = await loginResponse.json();

// Geschützten Endpunkt aufrufen
const postResponse = await fetch('http://localhost:3000/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Mein Beitrag',
    slug: 'mein-beitrag',
    content: 'Inhalt',
    status: 'published'
  })
});
```

## Middleware-Verwendung

### Authentication Middleware

Schützt Endpunkte, sodass nur authentifizierte Benutzer Zugriff haben:

```typescript
import { authenticate } from '../middleware/auth.js';

router.get('/protected', authenticate, (req, res) => {
  // Nur authentifizierte Benutzer können hier zugreifen
});
```

### Authorization Middleware (Spezifische Rollen)

Erlaubt nur bestimmte Rollen:

```typescript
import { authenticate, authorize } from '../middleware/auth.js';

// Nur Admin und Operator
router.delete('/posts/:id',
  authenticate,
  authorize('admin', 'operator'),
  deletePost
);
```

### Authorization Middleware (Mindest-Rolle)

Erlaubt eine Rolle und alle höheren Rollen:

```typescript
import { authenticate, authorizeMinRole } from '../middleware/auth.js';

// User, Operator und Admin können zugreifen
router.post('/posts',
  authenticate,
  authorizeMinRole('user'),
  createPost
);
```

## Testbenutzer

Für Entwicklung und Tests stehen folgende Benutzer zur Verfügung:

| Rolle     | Email                    | Passwort    | Verwendung                    |
|-----------|--------------------------|-------------|-------------------------------|
| admin     | admin@meincms.local      | admin123    | Vollständiger Systemzugriff   |
| operator  | operator@meincms.local   | operator123 | Content-Management            |
| user      | user@meincms.local       | user123     | Standard-Benutzer             |
| guest     | guest@meincms.local      | guest123    | Nur Lesezugriff               |

## Sicherheitshinweise

### Produktion

In einer Produktionsumgebung solltest du:

1. **JWT_SECRET ändern**: Verwende einen starken, zufälligen Secret Key
   ```bash
   JWT_SECRET=dein-sehr-sicherer-und-langer-secret-key-hier
   ```

2. **Token-Ablaufzeit anpassen**: Standard ist 7 Tage
   ```bash
   JWT_EXPIRES_IN=1d  # 1 Tag für mehr Sicherheit
   ```

3. **HTTPS verwenden**: Niemals JWTs über unverschlüsselte Verbindungen senden

4. **Testbenutzer löschen**: Entferne oder deaktiviere alle Testbenutzer

5. **Passwort-Richtlinien**: Implementiere starke Passwort-Anforderungen

### Best Practices

- Speichere Tokens sicher (httpOnly Cookies bevorzugt)
- Implementiere Token-Refresh-Mechanismus für lange Sessions
- Logge Security-Events (fehlgeschlagene Logins, etc.)
- Implementiere Rate Limiting für Login-Versuche
- Verwende CORS richtig konfiguriert

## Fehlerbehandlung

### Authentifizierungsfehler

- `401 Unauthorized`: Token fehlt, ist ungültig oder abgelaufen
- `403 Forbidden`: Benutzer hat keine Berechtigung für diese Aktion
- `404 Not Found`: Benutzer existiert nicht

### Beispiel-Fehlerantwort

```json
{
  "error": "Access denied",
  "message": "This action requires one of the following roles: admin, operator"
}
```
