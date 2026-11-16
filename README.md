# AgroBotiga · Frontend

Interfície web de **AgroBotiga**, una cooperativa agrícola fictícia. Aquesta part del
projecte correspon a la pràctica de la **Sessió 9** i és una demo totalment visual: les
pàgines **no es connecten encara amb el backend**.

## Tecnologies

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) per gestionar les rutes
- [Tailwind CSS](https://tailwindcss.com/) per a l'estil
- [Lucide React](https://lucide.dev/) per a les icones
- Il·lustracions SVG pròpies a `public/images` (sense dependències externes)

## Pàgines i rutes

| Ruta        | Pàgina     | Descripció                                                     |
| ----------- | ---------- | -------------------------------------------------------------- |
| `/`         | `Home`     | Pàgina d'inici amb hero, categories, productes i cooperativa.   |
| `/login`    | `Login`    | Formulari d'inici de sessió. En enviar-lo navega a `/`.         |
| `/register` | `Register` | Formulari de registre. En completar-lo navega a `/login`.       |

Flux de navegabilitat: **Registre → Login → Home**.

## Requisits previs

- **Node.js 20 o superior** (el projecte s'ha provat amb Node 24).
- **npm 10 o superior**.
- No cal tenir MongoDB ni el backend en marxa: aquest frontend és una demo visual.

## Inicialització del projecte

Des de la carpeta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Obre [http://localhost:5173](http://localhost:5173) al navegador. Vite mostrarà l'URL
exacta a la terminal; és recomanable fer servir `localhost` i no `127.0.0.1`.

### Comandes disponibles

| Comanda | Funció |
| --- | --- |
| `npm run dev` | Inicia el servidor de desenvolupament amb recàrrega en calent. |
| `npm run build` | Compila la versió de producció a `dist/`. |
| `npm run preview` | Serveix la versió compilada per comprovar-la. |

### Si la pàgina es recarrega sola

- Assegura't que només hi ha **un** servidor `npm run dev` en marxa.
- No executis `npm run build` mentre el servidor de desenvolupament estigui actiu.
- La carpeta `dist/` ja està exclosa del watcher de Vite a `vite.config.js`.
- Si el problema continua, atura el servidor amb `Ctrl+C`, esborra la carpeta
  `node_modules/.vite` i torna a executar `npm run dev`.

## Estructura

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── images/                 # Il·lustracions SVG (hero, productes...)
├── src/
│   ├── components/             # Header, Footer, Logo, ProductCard, AuthSide
│   ├── data/products.js        # Categories i productes de demostració
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.jsx                 # Layout general i contador visual de la cistella
│   ├── index.css               # Directives de Tailwind i components reutilitzables
│   └── main.jsx                # Configuració de React Router
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Documentació de la tasca

Les especificacions i el desglossament de tot el proccés es troba a:
[docs](../docs/):

- [Especificacions](../docs/session-09/specs.md)
- [Tasques](../docs/session-09/tasks.md)

## Notes

- Els formularis de login i registre són **només visuals**: no fan cap petició HTTP.
- Els enllaços de navegació i el botó d'afegir a la cistella funcionen com a demo
  d'interfície.
- L'idioma de la interfície és el català, d'acord amb la resta del projecte.

## Autor

Borja Lozano Porcel
