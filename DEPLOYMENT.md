# Guía de Despliegue - PersalOne Landing

## Objetivo

Servir persalone.com y www.persalone.com con el mismo contenido actualizado, sin 404 en rutas clean (`/app`, `/privacy`, etc.).

## Configuración Nginx (Lista para Copiar/Pegar)

### Opción 1: Redirect www → apex (RECOMENDADO)

Canonical: `https://persalone.com`

```bash
# Copiar nginx.conf a /etc/nginx/sites-available/
sudo cp nginx.conf /etc/nginx/sites-available/persalone.com

# Crear symlink en sites-enabled
sudo ln -s /etc/nginx/sites-available/persalone.com /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### Opción 2: Redirect apex → www

Si prefieres `https://www.persalone.com` como canonical, edita `nginx.conf`:

```nginx
# Cambiar en los bloques server:
server_name persalone.com;
return 301 https://www.persalone.com$request_uri;

# Y servir desde:
server_name www.persalone.com;
```

## Estructura de Archivos en Servidor

```
/var/www/persalone-landing/
├── index.html
├── app.html
├── privacy.html
├── delete-account.html
├── cookies.html
├── styles.css
├── faq.js
└── cookies-banner.js
```

## Deployment desde Git

```bash
# 1. SSH al servidor
ssh user@persalone.com

# 2. Navegar al directorio web
cd /var/www/persalone-landing

# 3. Pull latest changes
git pull origin main

# 4. Verificar permisos
sudo chown -R www-data:www-data /var/www/persalone-landing
sudo chmod -R 755 /var/www/persalone-landing

# 5. Recargar Nginx
sudo systemctl reload nginx
```

## Configuración SSL/TLS

### Con Let's Encrypt (Certbot)

```bash
# Instalar certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d persalone.com -d www.persalone.com

# Auto-renovación (ya configurada por certbot)
sudo certbot renew --dry-run
```

### Con certificado manual

Edita rutas en `nginx.conf`:

```nginx
ssl_certificate /ruta/a/tu/certificado.crt;
ssl_certificate_key /ruta/a/tu/clave-privada.key;
```

## Mapeo de Rutas (Sin Framework)

La configuración maneja:

| URL Limpia          | Archivo Real         | Método                          |
|---------------------|----------------------|---------------------------------|
| `/`                 | `index.html`         | `try_files /index.html`         |
| `/app`              | `app.html`           | `location = /app`               |
| `/privacy`          | `privacy.html`       | `location = /privacy`           |
| `/delete-account`   | `delete-account.html`| `location = /delete-account`    |
| `/cookies`          | `cookies.html`       | `location = /cookies`           |

## Canonical Redirect

- **www.persalone.com** → Redirect 301 a **persalone.com**
- **http://persalone.com** → Redirect 301 a **https://persalone.com**

Resultado: Una sola URL canonical para SEO.

## Checklist de Verificación (Sin curl)

### 1. Verificar Canonical Redirect

- [ ] Abrir `http://www.persalone.com` → Debe redirigir a `https://persalone.com`
- [ ] Abrir `http://persalone.com` → Debe redirigir a `https://persalone.com`
- [ ] Verificar en barra de navegador que URL final es `https://persalone.com`

### 2. Verificar Contenido Actualizado

- [ ] Abrir `https://persalone.com`
- [ ] Verificar que `<h1>` muestra: **"PersalOne: tu asistente de IA centrado en la privacidad y el cuidado digital."**
- [ ] Verificar que hero tiene fondo blanco (no verde oscuro)
- [ ] Verificar que CTA muestra: **"Únete a la beta cerrada"** (no "Próximamente")
- [ ] Verificar logo sin fondo blanco

### 3. Verificar Rutas Clean (Sin 404)

- [ ] `https://persalone.com/app` → Abre página de app (200 OK)
- [ ] `https://persalone.com/privacy` → Abre política privacidad (200 OK)
- [ ] `https://persalone.com/delete-account` → Abre página eliminación (200 OK)
- [ ] `https://persalone.com/cookies` → Abre política cookies (200 OK)

### 4. Verificar Assets

- [ ] `styles.css` carga correctamente
- [ ] `faq.js` funciona (acordeón FAQ se expande/colapsa)
- [ ] `cookies-banner.js` funciona (banner aparece y se puede cerrar)

## Troubleshooting

### 404 en rutas clean

```bash
# Verificar location blocks en nginx.conf
sudo nginx -T | grep "location ="

# Ver logs de error
sudo tail -f /var/log/nginx/error.log
```

### Redirect loop

- Verificar que solo hay un redirect por dominio (www → apex O apex → www, no ambos)
- Comprobar `return 301` statements en nginx.conf

### CSS no carga

```bash
# Verificar permisos
ls -la /var/www/persalone-landing/styles.css

# Debe ser readable por www-data
sudo chmod 644 /var/www/persalone-landing/styles.css
```

### SSL no funciona

```bash
# Verificar certificados
sudo certbot certificates

# Renovar manualmente
sudo certbot renew
```

## Logs

```bash
# Access log
sudo tail -f /var/log/nginx/access.log

# Error log
sudo tail -f /var/log/nginx/error.log
```

## Rollback (Si algo falla)

```bash
# Volver a commit anterior
cd /var/www/persalone-landing
git log --oneline -5
git reset --hard <commit-sha>

# O restaurar backup
sudo cp -r /var/backups/persalone-landing/* /var/www/persalone-landing/

# Recargar nginx
sudo systemctl reload nginx
```

## Performance

Cache headers ya configurados en `nginx.conf`:

- **HTML:** Sin cache (siempre fresh)
- **Assets estáticos (CSS/JS/imágenes):** 1 año con `immutable`
- **Gzip:** Habilitado para texto/CSS/JS

## Security

Headers de seguridad ya configurados:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- Deny access a archivos ocultos (`.git`, etc.)

## Contacto

Para issues de deployment: info@persalone.com
