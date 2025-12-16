# Checklist de Despliegue - Droplet (persalone-landing)

## Objetivo

Desplegar persalone-landing en droplet con Nginx, sin inventar rutas. Detectar configuración actual y actualizar.

---

## 📋 Checklist Paso a Paso

### 1. SSH al Droplet

```bash
ssh root@<droplet-ip>
# O con usuario específico
ssh user@persalone.com
```

✅ Verificar acceso exitoso

---

### 2. Detectar Root Activo de Nginx

**NO inventar rutas. Detectar la configuración actual:**

```bash
# Detectar document root actual
sudo nginx -T 2>/dev/null | grep -E "root\s+" | head -5

# Ejemplo de salida:
# root /var/www/html;
# root /var/www/persalone-landing;
# root /usr/share/nginx/html;
```

**Anotar el root detectado:**
```
ROOT_DETECTADO: _________________
```

**Si no hay config específica para persalone.com:**

```bash
# Verificar sites-available
ls -la /etc/nginx/sites-available/

# Verificar sites-enabled
ls -la /etc/nginx/sites-enabled/
```

---

### 3. Navegar al Webroot

```bash
# Usar el ROOT_DETECTADO del paso 2
cd /var/www/persalone-landing

# O si no existe, crearlo
sudo mkdir -p /var/www/persalone-landing
cd /var/www/persalone-landing
```

✅ Confirmar directorio existe

---

### 4. Verificar Git Repository

```bash
# Si ya existe repo
git status

# Si es primera vez, clonar
git clone https://github.com/JuanMaPerals/persalone-landing.git .

# Verificar remote
git remote -v
```

✅ Repo presente y conectado a origin

---

### 5. Pull Latest Changes

```bash
# Pull desde main
git pull origin main

# Verificar cambios aplicados
git log --oneline -3

# Debe mostrar:
# 365825e Infrastructure: Nginx config + deployment guide (#6)
# 39216cd feat: redesign landing with clean white hero and brand kit (#5)
# b9d3631 Revert email to info@persalone.com - Production Fix (#4)
```

✅ Latest commit: `365825e` (o más reciente)

**Verificar archivos críticos presentes:**

```bash
ls -lh index.html app.html nginx.conf styles.css

# Debe mostrar:
# index.html    - ~10K
# app.html      - ~9K
# nginx.conf    - ~2.5K
# styles.css    - ~18K
```

✅ Archivos HTML/CSS presentes

---

### 6. Verificar Permisos

```bash
# Nginx user (usualmente www-data o nginx)
ps aux | grep nginx | grep -v grep | head -1

# Ajustar ownership
sudo chown -R www-data:www-data /var/www/persalone-landing

# Ajustar permisos
sudo chmod -R 755 /var/www/persalone-landing

# Archivos individuales
sudo chmod 644 /var/www/persalone-landing/*.html
sudo chmod 644 /var/www/persalone-landing/*.css
sudo chmod 644 /var/www/persalone-landing/*.js
```

✅ Permisos correctos (755 dirs, 644 files)

---

### 7. Copiar nginx.conf a sites-available

```bash
# Copiar config
sudo cp nginx.conf /etc/nginx/sites-available/persalone.com

# Verificar copiado
cat /etc/nginx/sites-available/persalone.com | head -20

# Debe mostrar:
# server {
#     listen 80;
#     listen [::]:80;
#     server_name www.persalone.com;
#     return 301 https://persalone.com$request_uri;
# }
```

✅ Config copiado

---

### 8. Crear Symlink en sites-enabled

```bash
# Verificar si ya existe
ls -la /etc/nginx/sites-enabled/ | grep persalone

# Si existe symlink viejo, removerlo
sudo rm /etc/nginx/sites-enabled/persalone.com

# Crear symlink nuevo
sudo ln -s /etc/nginx/sites-available/persalone.com /etc/nginx/sites-enabled/

# Verificar symlink
ls -la /etc/nginx/sites-enabled/ | grep persalone
# Debe mostrar: persalone.com -> ../sites-available/persalone.com
```

✅ Symlink creado

---

### 9. Ajustar Rutas SSL en nginx.conf (Si Aplica)

**Detectar rutas de certificados actuales:**

```bash
# Ver certificados existentes
sudo nginx -T 2>/dev/null | grep ssl_certificate | grep -v "#"

# Ejemplo salida:
# ssl_certificate /etc/letsencrypt/live/persalone.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/persalone.com/privkey.pem;
```

**Si las rutas difieren, editar nginx.conf:**

```bash
sudo nano /etc/nginx/sites-available/persalone.com

# Ajustar líneas:
# ssl_certificate /etc/letsencrypt/live/persalone.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/persalone.com/privkey.pem;
```

✅ Rutas SSL correctas

---

### 10. Verificar Configuración Nginx

```bash
# Test de sintaxis
sudo nginx -t

# Salida esperada:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

✅ Configuración válida

**Si hay errores:**

```bash
# Ver detalles del error
sudo nginx -t 2>&1

# Errores comunes:
# - Rutas SSL incorrectas → Ajustar en paso 9
# - Puerto 80/443 ya en uso → Verificar otros servers
# - Duplicate server_name → Remover configs viejas
```

---

### 11. Reload Nginx

```bash
# Reload (sin downtime)
sudo systemctl reload nginx

# Verificar status
sudo systemctl status nginx

# Salida esperada:
# Active: active (running)
```

✅ Nginx reloaded exitosamente

**Si falla el reload:**

```bash
# Ver logs de error
sudo tail -20 /var/log/nginx/error.log

# Restart completo (con downtime)
sudo systemctl restart nginx
```

---

### 12. Verificación en Navegador (Sin curl)

#### A. Canonical Redirect

- [ ] Abrir `http://www.persalone.com`
  - **Esperado:** Redirect a `https://persalone.com`
  - **Verificar:** URL final en barra navegador

- [ ] Abrir `http://persalone.com`
  - **Esperado:** Redirect a `https://persalone.com`
  - **Verificar:** URL final en barra navegador

✅ Canonical redirects funcionan

#### B. Hero Content Actualizado

- [ ] Abrir `https://persalone.com`
- [ ] Verificar `<h1>`:
  ```
  "PersalOne: tu asistente de IA centrado en la privacidad y el cuidado digital."
  ```
- [ ] Verificar fondo hero: **Blanco** (no verde oscuro)
- [ ] Verificar CTA: **"Únete a la beta cerrada"** (no "Próximamente")
- [ ] Verificar logo sin fondo blanco

✅ Contenido actualizado

#### C. Rutas Clean (Sin 404)

- [ ] `https://persalone.com/app` → Abre promo app (200 OK)
- [ ] `https://persalone.com/privacy` → Abre política privacidad (200 OK)
- [ ] `https://persalone.com/delete-account` → Abre eliminación cuenta (200 OK)
- [ ] `https://persalone.com/cookies` → Abre cookies policy (200 OK)

✅ Sin 404 en rutas clean

#### D. Assets & Funcionalidad

- [ ] CSS carga (página con estilos, no plain HTML)
- [ ] FAQ acordeón funciona (click expande/colapsa)
- [ ] Cookie banner aparece y se puede cerrar

✅ Funcionalidad completa

---

## 🔍 Troubleshooting

### Error: 404 en rutas clean (/app, /privacy)

```bash
# Verificar location blocks
sudo nginx -T | grep "location ="

# Debe mostrar:
# location = /app { try_files /app.html =404; }
# location = /privacy { try_files /privacy.html =404; }
# location = /delete-account { try_files /delete-account.html =404; }
# location = /cookies { try_files /cookies.html =404; }
```

**Si no aparecen:**
- Config no se aplicó → Volver a paso 7 (copiar nginx.conf)
- Symlink incorrecto → Volver a paso 8

---

### Error: CSS no carga

```bash
# Verificar permisos styles.css
ls -la /var/www/persalone-landing/styles.css

# Debe ser readable (644)
sudo chmod 644 /var/www/persalone-landing/styles.css

# Verificar en navegador (F12 → Network)
# styles.css debe ser 200 OK
```

---

### Error: Redirect loop

```bash
# Verificar redirect statements
sudo nginx -T | grep "return 301"

# Debe haber SOLO:
# 1. www → apex: return 301 https://persalone.com$request_uri;
# 2. http → https para apex

# NO debe haber redirect bidireccional (apex → www Y www → apex)
```

---

### Error: SSL certificate invalid

```bash
# Verificar certificados
sudo certbot certificates

# Renovar si expirados
sudo certbot renew

# Re-obtener si faltan
sudo certbot --nginx -d persalone.com -d www.persalone.com
```

---

## 📊 Logs Útiles

```bash
# Access log (tráfico)
sudo tail -50 /var/log/nginx/access.log

# Error log (problemas)
sudo tail -50 /var/log/nginx/error.log

# Filtrar por dominio
sudo grep "persalone.com" /var/log/nginx/access.log | tail -20
```

---

## ✅ Checklist Final

- [ ] SSH exitoso al droplet
- [ ] Root detectado: `/var/www/persalone-landing`
- [ ] Git pull ejecutado (commit 365825e o más reciente)
- [ ] Archivos presentes: index.html, app.html, nginx.conf, styles.css
- [ ] Permisos correctos (755/644, www-data owner)
- [ ] nginx.conf copiado a sites-available
- [ ] Symlink creado en sites-enabled
- [ ] Rutas SSL ajustadas (si aplica)
- [ ] `nginx -t` exitoso
- [ ] `systemctl reload nginx` exitoso
- [ ] Canonical redirects funcionan (www → apex)
- [ ] H1 correcto: "...centrado en la privacidad y el cuidado digital."
- [ ] CTA correcto: "Únete a la beta cerrada"
- [ ] Rutas clean sin 404 (/app, /privacy, /delete-account, /cookies)
- [ ] CSS carga correctamente
- [ ] FAQ y cookie banner funcionan

**Si todas las casillas están marcadas: ✅ Deploy exitoso**

---

## 📞 Rollback de Emergencia

```bash
# Volver a commit anterior
cd /var/www/persalone-landing
git log --oneline -5
git reset --hard <commit-anterior>

# Reload nginx
sudo systemctl reload nginx
```

---

## 📝 Notas

- **NO usar curl** para verificación (usar navegador)
- **NO inventar rutas** (detectar con `nginx -T`)
- **Backup antes de cambios:**
  ```bash
  sudo cp /etc/nginx/sites-available/persalone.com /etc/nginx/sites-available/persalone.com.backup
  ```

---

**Última actualización:** 2025-12-16
**Para:** Droplet deployment de persalone-landing
**Contacto:** info@persalone.com
