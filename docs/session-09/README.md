# Tarea 01 · Sessió 9 — Frontend AgroBotiga

Documentación de la primera tarea del frontend: creación de la interfaz React con las
páginas de **registro**, **login** y **home**, navegación entre ellas y estilos con
Tailwind CSS.

## Estado

- **Estado:** completada.
- **Fecha:** 16/11/2026.
- **Autor:** Borja Lozano Porcel.
- **Ámbito:** `frontend/` exclusivamente; el backend no se ha modificado.

## Documentos

| Documento | Contenido |
| --- | --- |
| [Especificaciones](./specs.md) | Alcance, requisitos funcionales, diseño y criterios de aceptación. |
| [Tareas](./tasks.md) | Desglose de tareas, estado y evidencias de verificación. |

## Resumen

La aplicación implementa un flujo visual completo:

```text
/register  →  /login  →  /
```

- **Home:** página comercial con hero, categorías, productos de temporada, sección de
  cooperativa, newsletter y footer.
- **Login:** formulario visual con validación HTML y navegación a la home.
- **Registro:** formulario visual con validación de contraseñas; al completarlo navega
  al login y muestra un aviso de confirmación.
- **Estilo:** Tailwind CSS con paleta de cooperativa agraria, tipografías Fraunces y
  DM Sans, e ilustraciones SVG locales.
- **Backend:** no se realiza ninguna petición HTTP; todos los formularios son de
  demostración.

## Puesta en marcha rápida

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`.

La guía completa está en el [README del frontend](../../frontend/README.md).
