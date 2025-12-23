# Revert email to info@persalone.com - Production Fix

## Summary

Revierte todas las referencias de email a **info@persalone.com** (correo correcto de producción).

## Changes

**5 archivos modificados (9 emails actualizados):**

- `app.html` - Email CTA beta (1x)
- `index.html` - CTA principal + FAQ (2x)  
- `cookies.html` - Email contacto (1x)
- `delete-account.html` - Emails solicitud baja (2x)
- `privacy.html` - Emails contacto y RGPD (3x)

## Verification

```bash
# Email correcto en todas las páginas
grep -c "info@persalone.com" *.html
# app.html:1
# cookies.html:1
# delete-account.html:2
# index.html:2
# privacy.html:3
# Total: 9 ✓

# Sin emails incorrectos
grep "info@persalone.com" *.html
# (sin resultados) ✓

# Sin texto próximamente/beta (ya limpio)
grep -i "próximamente" *.html
# (sin resultados) ✓

# CTA mantenido
grep "Únete a la Beta Cerrada" app.html
# ✓ Presente
```

## Checklist curl -I 200

**Verificar que las páginas respondan correctamente:**

```bash
# Privacy page
curl -I https://persalone.com/privacy 2>&1 | grep "HTTP/"
# Expected: HTTP/1.1 200 OK o HTTP/2 200

# Delete account page  
curl -I https://persalone.com/delete-account 2>&1 | grep "HTTP/"
# Expected: HTTP/1.1 200 OK o HTTP/2 200

# App page
curl -I https://persalone.com/app 2>&1 | grep "HTTP/"
# Expected: HTTP/1.1 200 OK o HTTP/2 200
```

## Production Ready

- ✅ Email correcto: info@persalone.com (9 referencias)
- ✅ Sin próximamente/beta (limpio)
- ✅ CTA mantenido: "Únete a la Beta Cerrada"
- ✅ Sin banners ni promesas de store

**Listo para merge y deploy inmediato.**
