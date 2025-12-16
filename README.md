# PersalOne Landing Page

Landing page oficial para [persalone.com](https://persalone.com) - Tu asistente de IA centrado en la privacidad y el cuidado digital.

## 🎯 Descripción

Landing estático (HTML/CSS/JS puro, sin frameworks) con:

- **Hero limpio** con fondo blanco
- **Kit de marca consistente**: verde (#22572B) + ocre (#C69C34) + blanco
- **Rutas clean** sin extensiones (.html)
- **Responsive** y accesible

## 📁 Estructura

```
persalone-landing/
├── index.html              # Home page
├── app.html               # Promo de la app
├── privacy.html           # Política de privacidad
├── delete-account.html    # Eliminación de cuenta
├── cookies.html           # Política de cookies
├── styles.css             # Estilos globales
├── faq.js                 # Acordeón FAQ
├── cookies-banner.js      # Banner de cookies
├── nginx.conf             # Configuración Nginx lista para producción
└── DEPLOYMENT.md          # Guía completa de deployment
```

## 🚀 Deployment

### Quick Start

1. **Clonar repo en servidor:**
   ```bash
   cd /var/www
   git clone <repo-url> persalone-landing
   cd persalone-landing
   ```

2. **Configurar Nginx:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/persalone.com
   sudo ln -s /etc/nginx/sites-available/persalone.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Configurar SSL con Certbot:**
   ```bash
   sudo certbot --nginx -d persalone.com -d www.persalone.com
   ```

4. **Verificar:**
   - Abrir https://persalone.com
   - Verificar `<h1>`: "PersalOne: tu asistente de IA centrado en la privacidad y el cuidado digital."
   - Verificar rutas: `/app`, `/privacy`, `/delete-account`, `/cookies` (sin 404)

### Deployment Completo

Ver **[DEPLOYMENT.md](./DEPLOYMENT.md)** para:
- Configuración Nginx detallada
- SSL/TLS setup
- Canonical redirects (www → apex)
- Mapeo de rutas clean
- Troubleshooting
- Logs y monitoring

## 🎨 Kit de Marca

```css
/* Colores */
--color-primary-green: #22572B;   /* Verde principal */
--color-accent-ochre: #C69C34;    /* Ocre para botones */
--color-white: #FFFFFF;           /* Fondo limpio */

/* Uso */
- Botones CTA: ocre
- Títulos H2/H3: verde
- Hero background: blanco
- Links: verde → hover ocre
```

## 📝 Contenido

### Hero Section

- **H1:** "PersalOne: tu asistente de IA centrado en la privacidad y el cuidado digital."
- **Subtitle:** "Decisiones digitales más seguras, sin invadir tu privacidad."
- **CTA:** "Únete a la beta cerrada" → `mailto:info@persalone.com`

### Páginas

- **/** - Home completo con FAQs
- **/app** - Promo de la aplicación móvil
- **/privacy** - Política de privacidad (RGPD compliant)
- **/delete-account** - Instrucciones para eliminar cuenta
- **/cookies** - Política de cookies técnicas

## 🔒 Privacidad & Legal

- ✅ RGPD compliant
- ✅ Solo cookies técnicas esenciales
- ✅ Sin trackers de terceros
- ✅ Sin publicidad
- ✅ Proceso claro de eliminación de datos

## 🛠️ Desarrollo Local

### Servidor local simple:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# Abrir: http://localhost:8000
```

### Verificar cambios:

1. Editar HTML/CSS
2. Refrescar navegador (no build step)
3. Verificar responsive (DevTools)
4. Verificar accesibilidad (Lighthouse)

## 📋 Checklist Pre-Deploy

- [ ] Verificar `<h1>` hero correcto
- [ ] Verificar CTA: "Únete a la beta cerrada"
- [ ] Verificar email: `info@persalone.com` (9 referencias)
- [ ] Sin texto "Próximamente" o "fase beta" en hero
- [ ] Logo sin fondo blanco (mix-blend-mode)
- [ ] Colores consistentes (verde/ocre/blanco)
- [ ] Links funcionan (todos los `<a href>`)
- [ ] FAQ acordeón funciona
- [ ] Cookie banner aparece y se cierra
- [ ] Responsive en mobile/tablet/desktop

## 🔄 Updates

### Para actualizar producción:

```bash
# SSH al servidor
ssh user@persalone.com

# Pull latest
cd /var/www/persalone-landing
git pull origin main

# Verificar permisos
sudo chown -R www-data:www-data .
sudo chmod -R 755 .

# Reload Nginx (si cambió nginx.conf)
sudo systemctl reload nginx
```

## 📊 SEO

- **Canonical URL:** https://persalone.com (www → apex redirect)
- **Meta description:** Presente en `<head>`
- **Open Graph:** Configurado en app.html
- **Sitemap:** Pendiente (próximamente)
- **robots.txt:** Pendiente (próximamente)

## 🐛 Troubleshooting

### 404 en /app o /privacy

→ Verificar `nginx.conf` tiene location blocks correctos
→ Ver logs: `sudo tail -f /var/log/nginx/error.log`

### CSS no carga

→ Verificar permisos: `ls -la styles.css`
→ Debe ser 644 y owned por www-data

### Redirect loop

→ Verificar solo UN redirect (www → apex O apex → www)
→ Comprobar `return 301` statements

Ver **[DEPLOYMENT.md](./DEPLOYMENT.md)** para troubleshooting completo.

## 📞 Contacto

**Email:** info@persalone.com
**Autor:** Juan Ma Perals
**Repo:** JuanMaPerals/persalone-landing

## 📄 Licencia

© 2025 PersalOne - Juan Ma Perals. Todos los derechos reservados.
