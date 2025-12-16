# Checklist de Verificación - PersalOne Landing

## Verificación Post-Deployment (Sin curl)

### ✅ 1. Canonical & Redirects

Abre en navegador (modo incógnito recomendado):

- [ ] `http://www.persalone.com`
  - **Esperado:** Redirect a `https://persalone.com`
  - **Verificar:** URL en barra = `https://persalone.com`

- [ ] `http://persalone.com`
  - **Esperado:** Redirect a `https://persalone.com`
  - **Verificar:** URL en barra = `https://persalone.com`

- [ ] `https://www.persalone.com`
  - **Esperado:** Redirect a `https://persalone.com`
  - **Verificar:** URL en barra = `https://persalone.com`

**Resultado:** Una sola URL canonical para SEO ✅

---

### ✅ 2. Hero Section (Contenido Actualizado)

Abre `https://persalone.com`:

- [ ] **H1 correcto:**
  - Texto: "PersalOne: tu asistente de IA centrado en la privacidad y el cuidado digital."
  - Color: Verde (#22572B)

- [ ] **Subtitle correcto:**
  - Texto: "Decisiones digitales más seguras, sin invadir tu privacidad."
  - Largo: 1 línea

- [ ] **CTA correcto:**
  - Texto: "Únete a la beta cerrada"
  - Color: Ocre (#C69C34)
  - Al hacer clic: Abre cliente de email con `mailto:info@persalone.com`

- [ ] **Fondo hero:**
  - Color: Blanco (NO verde oscuro)

- [ ] **Logo:**
  - Sin fondo blanco
  - Se integra limpiamente con hero blanco

**Verificar en HTML (F12 → Elements):**
```html
<h1>PersalOne: tu asistente de IA centrado en la privacidad y el cuidado digital.</h1>
<p class="hero-subtitle">Decisiones digitales más seguras, sin invadir tu privacidad.</p>
<a href="mailto:info@persalone.com?subject=Solicitud de acceso a PersalOne" class="cta-button">Únete a la beta cerrada</a>
```

---

### ✅ 3. Rutas Clean (Sin 404)

Abre cada URL y verifica que carga sin error:

- [ ] `https://persalone.com/app`
  - **Esperado:** Página de app con screenshots
  - **Verificar:** H1 = "App PersalOne - Asistente de Privacidad" (o similar)
  - **Status:** 200 OK (sin 404)

- [ ] `https://persalone.com/privacy`
  - **Esperado:** Política de privacidad
  - **Verificar:** H1 = "Política de Privacidad"
  - **Status:** 200 OK

- [ ] `https://persalone.com/delete-account`
  - **Esperado:** Instrucciones eliminación cuenta
  - **Verificar:** H1 = "Eliminar cuenta y datos"
  - **Status:** 200 OK

- [ ] `https://persalone.com/cookies`
  - **Esperado:** Política de cookies
  - **Verificar:** H1 = "Política de Cookies"
  - **Status:** 200 OK

**No debe haber 404 en ninguna ruta** ✅

---

### ✅ 4. Assets & Funcionalidad

En `https://persalone.com`:

- [ ] **styles.css carga:**
  - F12 → Network → Buscar `styles.css`
  - Status: 200 OK
  - Página se ve con estilos (no plain HTML)

- [ ] **FAQ funciona:**
  - Scroll a sección "Preguntas frecuentes"
  - Hacer clic en pregunta 02
  - **Esperado:** Panel se expande/colapsa
  - Verificar `faq.js` cargó: F12 → Network → `faq.js` (200 OK)

- [ ] **Cookie banner funciona:**
  - Banner aparece al fondo de la página
  - Botón "Aceptar" cierra el banner
  - Verificar `cookies-banner.js` cargó: F12 → Network

- [ ] **Logo carga:**
  - Imagen del escudo visible
  - Cloudinary URL responde
  - Sin fondo blanco (integrado con hero)

---

### ✅ 5. Responsive & Accesibilidad

Probar en diferentes tamaños:

- [ ] **Desktop (1920x1080):**
  - Layout correcto
  - Texto legible
  - Navegación horizontal

- [ ] **Tablet (768x1024):**
  - Layout adapta
  - Navegación apilada (si aplica)
  - Hero legible

- [ ] **Mobile (375x667):**
  - Todo el contenido accesible
  - CTA táctil (mínimo 44x44px)
  - FAQ expandible

**Herramientas:**
- Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
- Test en dispositivos reales si es posible

---

### ✅ 6. Email Correcto

Verificar que TODAS las referencias de email son `info@persalone.com`:

- [ ] CTA hero → `info@persalone.com`
- [ ] FAQ #5 → `info@persalone.com`
- [ ] Footer → `info@persalone.com`
- [ ] /privacy → `info@persalone.com` (3 referencias)
- [ ] /delete-account → `info@persalone.com` (2 referencias)
- [ ] /cookies → `info@persalone.com`

**Método rápido:**
F12 → Ctrl+F → Buscar "info@persalone" → Debe aparecer 9 veces ✅

---

### ✅ 7. Texto Prohibido

Buscar que NO aparezca:

- [ ] "Próximamente" → 0 resultados
- [ ] "próximamente" → 0 resultados
- [ ] "fase beta" en hero → 0 resultados
- [ ] "cuando esté disponible" → 0 resultados

**Método:**
F12 → Ctrl+F → Buscar cada término → Debe dar 0 resultados ✅

---

### ✅ 8. Kit de Marca Consistente

Verificar colores usando DevTools:

- [ ] **CTA button:**
  - Background: `#C69C34` (ocre)
  - Hover: Eleva con shadow

- [ ] **H2/H3 (secciones):**
  - Color: `#22572B` (verde)

- [ ] **Hero H1:**
  - Color: `#22572B` (verde)

- [ ] **Hero subtitle:**
  - Color: `#2C2C2C` (gris oscuro)

- [ ] **Hero background:**
  - Color: `#FFFFFF` (blanco)

**Método:**
F12 → Select element → Computed → Verificar valores

---

### ✅ 9. Links Funcionan

Probar todos los links internos:

- [ ] Header → Inicio, La App, Privacidad, etc.
- [ ] Footer → Política privacidad, Eliminación cuenta, Cookies
- [ ] FAQ → Links a /privacy, /delete-account
- [ ] CTA → mailto funciona

**Ningún link roto** ✅

---

### ✅ 10. SSL & Security Headers

En navegador:

- [ ] Candado verde/seguro en barra URL
- [ ] Certificado válido (no expirado)
- [ ] No hay warnings de mixed content

**Verificar headers (opcional):**
F12 → Network → Seleccionar documento → Headers:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

---

## 📝 Resultado Final

Si TODAS las casillas están marcadas ✅:

**🎉 Deployment exitoso - persalone.com está en producción actualizado**

---

## 🐛 Si algo falla:

1. **404 en rutas:** Ver `nginx.conf` location blocks
2. **Redirect loop:** Verificar canonical (solo un redirect)
3. **CSS no carga:** Verificar permisos (644, www-data)
4. **Contenido viejo:** Hard refresh (Ctrl+Shift+R), limpiar cache

Ver **DEPLOYMENT.md** para troubleshooting completo.

---

## 📊 Benchmark Performance (Opcional)

Usar Lighthouse (F12 → Lighthouse):

- [ ] Performance: >90
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >90

---

**Última actualización:** 2025-12-16
**Versión:** v1.0 - Hero blanco + rutas clean
