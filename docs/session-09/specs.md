# Especificaciones — Tarea 01 · Sessió 9

## 1. Datos de la tarea

| Campo | Valor |
| --- | --- |
| Proyecto | AgroBotiga · E-commerce |
| Tarea | 01 · Frontend inicial |
| Sesión | Sessió 9 (14) |
| Autor | Borja Lozano Porcel |
| Fecha | 16/11/2026 |
| Estado | Completada |
| Tecnologías | React 19, Vite 6, React Router 7, Tailwind CSS 3, Lucide React |

## 2. Contexto

El proyecto ya dispone de un backend con API REST para usuarios, categorías y productos.
La Sessió 9 introduce la parte visual del e-commerce: crear el proyecto React con Vite,
configurar rutas y construir una primera interfaz con las páginas de registro, login y
home.

En esta tarea el frontend es **independiente del backend**. No se consume ningún
endpoint ni se guardan sesiones reales. El objetivo es validar la estructura, las rutas,
la navegabilidad y la interfaz.

## 3. Objetivo

Construir un frontend funcional y navegable que permita:

1. Ver una página de inicio con productos destacados.
2. Acceder a una página de login.
3. Acceder a una página de registro.
4. Navegar de registro a login y de login a home.
5. Disfrutar de una interfaz coherente con una cooperativa agrícola, responsive y
   accesible.

## 4. Alcance

### Incluido

- Proyecto React creado con Vite dentro de `frontend/`.
- React Router para las rutas `/`, `/login` y `/register`.
- Página Home con diferentes productos.
- Formularios visuales de login y registro.
- Navegación completa entre las tres páginas.
- Tailwind CSS con tema de cooperativa agraria.
- Componentes reutilizables y assets SVG locales.
- Diseño responsive.
- Documentación de la tarea.

### Excluido

- Conexión con la API del backend.
- Autenticación real con JWT.
- Persistencia de usuarios, sesiones o carrito.
- Checkout real.
- Panel de administración.
- Tests unitarios o end-to-end formales.

## 5. Requisitos funcionales

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-01 | El proyecto debe crearse con React y Vite dentro de `frontend/`. | Alta |
| RF-02 | React Router debe gestionar las rutas `/`, `/login` y `/register`. | Alta |
| RF-03 | La Home debe mostrar un mínimo de 8 productos diferentes. | Alta |
| RF-04 | La Home debe incluir hero, categorías, productos y footer. | Alta |
| RF-05 | El registro debe incluir nombre, apellidos, email, teléfono, contraseña y confirmación. | Alta |
| RF-06 | El login debe incluir email y contraseña. | Alta |
| RF-07 | El registro debe navegar al login al completarse. | Alta |
| RF-08 | El login debe navegar a la home al completarse. | Alta |
| RF-09 | Los formularios no deben realizar peticiones al backend. | Alta |
| RF-10 | Cualquier ruta desconocida debe redirigir a la Home. | Media |
| RF-11 | El estado de la cesta debe actualizarse visualmente al añadir un producto. | Baja |
| RF-12 | Los filtros de categoría deben mostrar solo los productos de la categoría seleccionada. | Baja |
| RF-13 | El newsletter debe mostrar confirmación visual tras el envío. | Baja |

## 6. Rutas y navegación

| Ruta | Página | Comportamiento |
| --- | --- | --- |
| `/` | Home | Página principal con productos y secciones informativas. |
| `/login` | Login | Formulario visual; al enviar navega a `/`. |
| `/register` | Registro | Formulario visual; al enviar navega a `/login` con aviso de éxito. |
| `*` | Redirección | Redirige a `/`. |

Flujo principal:

```text
/register → /login → /
```

También existen enlaces directos:

- Login → Registro.
- Registro → Login.
- Home → Login.
- Home → Registro.
- Footer → Login / Registro.

## 7. Diseño de interfaz

### Identidad

- Marca: **AgroBotiga · Cooperativa agrícola**.
- Tono: cercano, natural, artesanal y de proximidad.
- Idioma de la interfaz: catalán.

### Paleta

| Uso | Color |
| --- | --- |
| Fondo principal | `#FBF7EF` (crema) |
| Fondo secundario | `#F1E8D7` (arena) |
| Verde principal | `#2E4526` |
| Verde oscuro | `#12200F` |
| Verde claro | `#A6C494` |
| Terracota | `#B85C38` |
| Trigo | `#D9A441` |
| Texto | `#1E2A22` |

### Tipografía

- Títulos: **Fraunces** (serif, editorial).
- Texto e interfaz: **DM Sans** (sans serif).

### Componentes principales

- Header sticky con navegación, buscador, cesta y accesos de sesión.
- Hero con ilustración SVG y tarjetas flotantes.
- Tarjetas de producto con imagen, categoría, valoración, precio y acción de cesta.
- Sección de cooperativa con listado de ventajas.
- Newsletter con formulario y estado de confirmación.
- Footer con columnas, contacto y redes.
- Panel lateral de autenticación reutilizable (`AuthSide`).
- Formularios con iconos, mostrar/ocultar contraseña y mensajes de error.

### Assets

Todas las ilustraciones son SVG locales en `public/images`:

- `hero-farm.svg`
- `farmer.svg`
- `auth-landscape.svg`
- `products/*.svg` (8 productos)

No se depende de imágenes externas.

## 8. Requisitos no funcionales

| ID | Requisito |
| --- | --- |
| RNF-01 | Diseño responsive para móvil, tablet y escritorio. |
| RNF-02 | Etiquetas `label` asociadas a los campos del formulario. |
| RNF-03 | Estados de foco visibles en enlaces, botones e inputs. |
| RNF-04 | Botones con `aria-label` cuando solo muestran un icono. |
| RNF-05 | Código organizado por páginas, componentes y datos. |
| RNF-06 | Sin dependencias de imágenes remotas para evitar fallos de carga. |
| RNF-07 | Build de producción sin errores con `npm run build`. |
| RNF-08 | El servidor de desarrollo no debe recargar por artefactos de `dist/`. |

## 9. Criterios de aceptación

- [x] `frontend/` contiene un proyecto React con Vite.
- [x] Existen las páginas `Home.jsx`, `Login.jsx` y `Register.jsx`.
- [x] Las rutas `/`, `/login` y `/register` funcionan.
- [x] La Home muestra 8 productos diferentes.
- [x] El registro navega al login.
- [x] El login navega a la home.
- [x] Los formularios no hacen peticiones HTTP.
- [x] El diseño es responsive y usa Tailwind CSS.
- [x] Se usa una paleta y tipografías coherentes con una cooperativa agrícola.
- [x] `npm run build` finaliza correctamente.
- [x] La navegación se ha verificado de forma automatizada.

## 10. Incidencia corregida

Durante la tarea se detectó que Vite recargaba la página al generar el build porque la
carpeta `dist/` está dentro de la raíz del proyecto y era vigilada por el watcher.

**Solución aplicada en `vite.config.js`:**

```js
server: {
  watch: {
    ignored: ['**/dist/**'],
  },
}
```

Con esto, los artefactos de `npm run build` ya no provocan recargas completas mientras
el servidor de desarrollo está activo.

## 11. Verificación

Comandos utilizados:

```bash
cd frontend
npm install
npm run build
npm run dev
```

Pruebas realizadas:

1. Apertura de la Home y comprobación del título.
2. Navegación Home → Registro.
3. Envío del registro y llegada a `/login`.
4. Comprobación del aviso de cuenta creada.
5. Envío del login y llegada a `/`.
6. Filtro por categoría y adición de un producto a la cesta.
7. Apertura del menú móvil a 500 px de ancho.

Resultado: **todas las comprobaciones superadas**.

## 12. Trabajo futuro

- Conectar el login y el registro con la API real.
- Gestionar access token y refresh token.
- Persistir la cesta y el usuario.
- Añadir detalle de producto, checkout y pedidos.
- Incorporar tests end-to-end al repositorio.
