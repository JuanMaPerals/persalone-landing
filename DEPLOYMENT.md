# Nginx Configuration for PersalOne Landing

## Clean URLs (Remove .html extension)

Add this configuration to your nginx server block to enable clean URLs:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name persalone.com www.persalone.com;

    root /var/www/persalone-landing;
    index index.html;

    # Clean URLs - map /privacy to privacy.html
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Specific mappings for important pages
    location = /privacy {
        try_files /privacy.html =404;
    }

    location = /delete-account {
        try_files /delete-account.html =404;
    }

    location = /app {
        try_files /app.html =404;
    }

    location = /cookies {
        try_files /cookies.html =404;
    }

    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    gzip_min_length 256;

    # Error pages
    error_page 404 /index.html;
}

# HTTPS redirect (recommended)
server {
    listen 80;
    listen [::]:80;
    server_name persalone.com www.persalone.com;
    return 301 https://persalone.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name persalone.com www.persalone.com;

    # SSL configuration (adjust paths to your certificates)
    ssl_certificate /path/to/your/fullchain.pem;
    ssl_certificate_key /path/to/your/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... (same configuration as above)
}
```

## Alternative: Apache .htaccess

If you're using Apache instead of Nginx, create a `.htaccess` file:

```apache
# Enable rewrite engine
RewriteEngine On

# Remove .html extension
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$">
  Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>
```

## Deployment Checklist

### 1. Upload Files
Upload all files to your web server:
```bash
/var/www/persalone-landing/
├── index.html
├── app.html
├── privacy.html
├── delete-account.html
├── cookies.html
├── styles.css
├── cookies-banner.js
├── faq.js
└── assets/
    └── img/
        ├── app-home.png
        ├── app-webcheck.png
        └── app-academy.png
```

### 2. Configure Server
- **Nginx**: Add configuration to `/etc/nginx/sites-available/persalone.com`
- **Apache**: Create `.htaccess` in root directory

### 3. Test URLs
Verify all pages respond with **200 OK**:

```bash
# Test privacy page
curl -I https://persalone.com/privacy
# Expected: HTTP/2 200

# Test delete-account page
curl -I https://persalone.com/delete-account
# Expected: HTTP/2 200

# Test app page
curl -I https://persalone.com/app
# Expected: HTTP/2 200

# Test with .html extension (should also work)
curl -I https://persalone.com/app.html
# Expected: HTTP/2 200
```

### 4. Verify Content
Open in browser and verify:
- [ ] `/privacy` loads correctly
- [ ] `/delete-account` loads correctly
- [ ] `/app` loads correctly (with screenshots and CTA)
- [ ] No "próximamente" or "beta" text visible
- [ ] CTA button links to `mailto:info@persalone.com`
- [ ] All CSS and images load correctly

### 5. SEO Check
Verify meta tags:
```bash
curl -s https://persalone.com/app | grep -E '<title>|<meta name="description"|og:title'
```

Expected output:
- `<title>App PersalOne - Asistente de Privacidad y Seguridad Digital</title>`
- `<meta name="description" content="Tu asistente de IA centrado en la privacidad..."`
- `<meta property="og:title" content="App PersalOne - Asistente de Privacidad">`

## IONOS Hosting Specifics

If hosted on IONOS, you may need to:

1. **Use .htaccess** (IONOS typically uses Apache)
2. **Enable SSL** via IONOS control panel (usually free with Let's Encrypt)
3. **Set document root** to the uploaded directory
4. **Verify PHP is not required** (static HTML only)

## Troubleshooting

### 404 Errors
- Check file names match exactly (case-sensitive on Linux servers)
- Verify server configuration is active: `sudo nginx -t` or check Apache logs
- Check file permissions: `chmod 644 *.html`

### CSS Not Loading
- Verify `styles.css` is in the same directory as HTML files
- Check browser console for 404 errors
- Clear browser cache

### Clean URLs Not Working
- Verify rewrite engine is enabled (Nginx/Apache)
- Check server logs: `/var/log/nginx/error.log` or `/var/log/apache2/error.log`
- Test with .html extension first to isolate the issue

---

**Last Updated:** 2025-12-16
