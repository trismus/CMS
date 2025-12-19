FROM nginx:alpine

# Kopiere nginx Konfiguration
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Kopiere SSL Zertifikate
COPY ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ssl/key.pem /etc/nginx/ssl/key.pem

# Expose HTTP und HTTPS Ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
