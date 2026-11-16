# Tareas — Tarea 01 · Sessió 9

## Resumen

| Estado | Tareas |
| --- | --- |
| Completadas | 13 |
| Pendientes | 0 |
| Bloqueadas | 0 |

---

## T01 · Crear el proyecto React con Vite

- [x] Crear la estructura del proyecto dentro de `frontend/`.
- [x] Configurar `package.json`.
- [x] Instalar React, React DOM y Vite.
- [x] Añadir `vite.config.js` con el plugin de React.

**Archivos:** `frontend/package.json`, `frontend/vite.config.js`, `frontend/index.html`.

**Criterio:** `npm run dev` inicia el servidor y `npm run build` compila sin errores.

---

## T02 · Configurar Tailwind CSS

- [x] Instalar Tailwind CSS, PostCSS y Autoprefixer.
- [x] Crear `tailwind.config.js`.
- [x] Crear `postcss.config.js`.
- [x] Definir colores, tipografías y sombras del tema.
- [x] Crear componentes reutilizables en `src/index.css`.

**Archivos:** `frontend/tailwind.config.js`, `frontend/postcss.config.js`,
`frontend/src/index.css`.

**Criterio:** las utilidades de Tailwind se aplican correctamente en todas las páginas.

---

## T03 · Configurar React Router

- [x] Instalar `react-router-dom`.
- [x] Crear `BrowserRouter` en `main.jsx`.
- [x] Definir las rutas `/`, `/login` y `/register`.
- [x] Añadir redirección de rutas desconocidas a `/`.

**Archivos:** `frontend/src/main.jsx`.

**Criterio:** cada URL renderiza su página correspondiente.

---

## T04 · Crear el layout y los componentes compartidos

- [x] Crear `App.jsx` con layout general.
- [x] Ocultar header y footer en las páginas de autenticación.
- [x] Crear `Logo`, `Header` y `Footer`.
- [x] Crear `AuthSide` para los paneles laterales de login y registro.
- [x] Crear `ProductCard`.
- [x] Añadir scroll al inicio al cambiar de ruta.

**Archivos:** `frontend/src/App.jsx`, `frontend/src/components/`.

**Criterio:** el layout es consistente y reutilizable.

---

## T05 · Construir la página Home

- [x] Crear hero con mensaje principal y llamadas a la acción.
- [x] Añadir estadísticas de la cooperativa.
- [x] Añadir filtros por categoría.
- [x] Crear catálogo de 8 productos.
- [x] Añadir sección de cooperativa.
- [x] Añadir newsletter con confirmación visual.
- [x] Añadir footer con información de contacto.
- [x] Añadir contador visual de la cesta.

**Archivos:** `frontend/src/pages/Home.jsx`, `frontend/src/data/products.js`,
`frontend/src/components/ProductCard.jsx`.

**Criterio:** se muestran productos diferentes y se puede filtrar por categoría.

---

## T06 · Construir la página de Login

- [x] Crear formulario de email y contraseña.
- [x] Añadir mostrar/ocultar contraseña.
- [x] Añadir checkbox de recordar sesión.
- [x] Añadir enlace a recuperación de contraseña.
- [x] Navegar a `/` al enviar el formulario.
- [x] Enlazar con la página de registro.
- [x] Mostrar aviso cuando el usuario viene del registro.

**Archivos:** `frontend/src/pages/Login.jsx`.

**Criterio:** un formulario válido navega a la Home sin llamar al backend.

---

## T07 · Construir la página de Registro

- [x] Crear campos de nombre, apellidos, email y teléfono.
- [x] Crear campos de contraseña y confirmación.
- [x] Añadir mostrar/ocultar contraseña.
- [x] Validar longitud mínima de contraseña.
- [x] Validar que las contraseñas coinciden.
- [x] Añadir aceptación de condiciones.
- [x] Navegar a `/login` al completar el formulario.
- [x] Enlazar con la página de login.

**Archivos:** `frontend/src/pages/Register.jsx`.

**Criterio:** un registro válido navega al login y muestra el aviso de éxito.

---

## T08 · Verificar el flujo de navegación

- [x] Home → Registro.
- [x] Registro → Login.
- [x] Login → Home.
- [x] Login → Registro.
- [x] Footer → Login / Registro.
- [x] Logo → Home.

**Criterio:** el flujo `Registro → Login → Home` funciona sin recargar la página.

---

## T09 · Crear las ilustraciones locales

- [x] Crear ilustración del hero.
- [x] Crear ilustración de la pagesa.
- [x] Crear paisaje para las páginas de autenticación.
- [x] Crear 8 ilustraciones de producto.
- [x] Crear favicon.

**Archivos:** `frontend/public/favicon.svg`, `frontend/public/images/`.

**Criterio:** la interfaz no depende de imágenes remotas.

---

## T10 · Responsive y accesibilidad

- [x] Adaptar header y menú a móvil.
- [x] Adaptar hero, productos, cooperativa y newsletter.
- [x] Ocultar el panel lateral de autenticación en móvil.
- [x] Añadir etiquetas a todos los campos.
- [x] Añadir foco visible y `aria-label` en botones de icono.
- [x] Revisar contraste y jerarquía tipográfica.

**Criterio:** la interfaz se usa correctamente a 500, 768, 1024, 1280 y 1440 px.

---

## T11 · Verificar build y navegación

- [x] Ejecutar `npm install`.
- [x] Ejecutar `npm run build`.
- [x] Verificar la Home en navegador.
- [x] Verificar el flujo completo registro → login → home.
- [x] Verificar filtros de producto.
- [x] Verificar contador de cesta.
- [x] Verificar menú móvil.

**Evidencia:** build correcto y prueba de navegación superada.

---

## T12 · Documentar la tarea

- [x] Crear carpeta `docs/session-09/`.
- [x] Crear índice de la tarea.
- [x] Crear especificaciones.
- [x] Crear listado de tareas.
- [x] Actualizar el README del frontend con la puesta en marcha.

**Archivos:** `docs/session-09/`, `frontend/README.md`.

**Criterio:** cualquier persona puede entender el alcance y arrancar el proyecto.

---

## T13 · Corregir recargas de Vite por `dist/`

- [x] Identificar que Vite vigilaba la carpeta `dist/`.
- [x] Excluir `dist` del watcher en `vite.config.js`.
- [x] Documentar la incidencia.
- [x] Verificar que modificar `dist/index.html` ya no provoca una recarga.

**Archivos:** `frontend/vite.config.js`, `docs/session-09/specs.md`.

**Criterio:** guardar o compilar no provoca recargas completas inesperadas.

---

## Trabajo futuro

- [ ] Conectar login y registro con la API real.
- [ ] Guardar tokens de sesión de forma segura.
- [ ] Persistir la cesta entre navegaciones.
- [ ] Crear página de detalle de producto.
- [ ] Implementar checkout y pedidos.
- [ ] Añadir tests end-to-end.
- [ ] Revisar la accesibilidad con herramientas automáticas.
