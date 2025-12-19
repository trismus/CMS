# Nginx Reverse Proxy

Nginx fungiert als Reverse Proxy für Base und bietet HTTP/HTTPS Zugriff.

## 🌐 Funktionen

- **Reverse Proxy** für Frontend und Backend
- **HTTPS** mit selbstsignierten SSL-Zertifikaten
- **HTTP zu HTTPS** Redirect
- **WebSocket Support** für Vite HMR
- **Gzip Compression** für bessere Performance
- **Sicherheits-Header** (X-Frame-Options, X-XSS-Protection, etc.)

## 📁 Struktur

```
nginx/
├── conf.d/
│   └── default.conf      # Nginx Konfiguration
├── ssl/
│   ├── cert.pem          # SSL Zertifikat
│   ├── key.pem           # SSL Private Key
│   └── openssl.cnf       # OpenSSL Config
├── Dockerfile            # nginx Container
├── .dockerignore
└── README.md
```

## 🔐 SSL-Zertifikate

### Development (Selbstsigniert)

Die SSL-Zertifikate sind selbstsigniert und gültig für:
- `localhost`
- `base.local`
- `*.base.local`
- `127.0.0.1`

**Gültigkeit:** 365 Tage

### Browser-Warnung

Da die Zertifikate selbstsigniert sind, zeigen Browser eine Sicherheitswarnung. Dies ist normal für Development:

- **Chrome/Edge**: Klicke auf "Erweitert" → "Trotzdem fortfahren"
- **Firefox**: Klicke auf "Erweitert" → "Risiko akzeptieren und fortfahren"

### Neue Zertifikate generieren

```bash
cd nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem \
  -out cert.pem \
  -config openssl.cnf \
  -extensions v3_req
```

### Production

Für Production solltest du **Let's Encrypt** verwenden:

```bash
# Certbot installieren
sudo apt-get install certbot

# Zertifikat anfordern
sudo certbot certonly --standalone -d yourdomain.com
```

Dann in `conf.d/default.conf` die Pfade anpassen:
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

## 🔧 Konfiguration

### Port-Mapping

- **Port 80** (HTTP) → Redirect zu HTTPS
- **Port 443** (HTTPS) → Frontend & Backend

### Routen

- `/` → Frontend (Vite Dev Server)
- `/api/*` → Backend (Express API)

### Upstream-Server

```nginx
upstream frontend {
    server frontend:5173;  # Vite Dev Server
}

upstream backend {
    server backend:3000;   # Express API
}
```

### WebSocket Support

WebSocket-Verbindungen für Vite HMR sind aktiviert:

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_cache_bypass $http_upgrade;
```

## 🚀 URLs

Nach dem Start ist Base erreichbar unter:

- **HTTP**: http://localhost (Redirect zu HTTPS)
- **HTTPS**: https://localhost
- **MailHog**: http://localhost:8025

## 🔍 Logs

### Nginx Logs anzeigen

```bash
# Alle Logs
docker-compose logs nginx

# Live Logs
docker-compose logs -f nginx

# Letzte 50 Zeilen
docker-compose logs --tail=50 nginx
```

### Nginx neu laden

```bash
# Konfiguration neu laden (ohne Restart)
docker-compose exec nginx nginx -s reload

# Container neu starten
docker-compose restart nginx
```

## 🛠️ Troubleshooting

### Port bereits in Verwendung

Wenn Port 80 oder 443 bereits verwendet wird:

```bash
# Windows: Prüfe welcher Prozess den Port nutzt
netstat -ano | findstr :80
netstat -ano | findstr :443

# Stoppe IIS oder andere Webserver
net stop http
```

### SSL-Fehler

Wenn SSL nicht funktioniert:

```bash
# Prüfe ob Zertifikate existieren
docker-compose exec nginx ls -la /etc/nginx/ssl/

# Teste nginx Konfiguration
docker-compose exec nginx nginx -t
```

### CORS-Fehler

Wenn CORS-Fehler auftreten, prüfe dass `VITE_API_URL` auf `/api` gesetzt ist:

```yaml
# docker-compose.yml
frontend:
  environment:
    VITE_API_URL: /api  # Wichtig: Relativer Pfad!
```

## 📊 Performance

### Gzip Compression

Aktiviert für:
- `text/plain`
- `text/css`
- `text/xml`
- `text/javascript`
- `application/x-javascript`
- `application/xml+rss`
- `application/json`

### Caching

Browser-Caching ist konfiguriert für statische Assets.

## 🔒 Sicherheit

### Aktivierte Header

```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### SSL-Konfiguration

- **Protokolle**: TLSv1.2, TLSv1.3
- **Ciphers**: HIGH:!aNULL:!MD5
- **HTTP/2**: Aktiviert

## 📝 Weitere Informationen

- [Nginx Dokumentation](https://nginx.org/en/docs/)
- [Nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Let's Encrypt](https://letsencrypt.org/)
