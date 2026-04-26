# ARQBIT LABS

Plataforma web de catalogo de servicios tecnologicos desarrollada con **Angular 17**, **Tailwind CSS** y **GSAP**, como proyecto de la materia **Virtual / Front End** del Politecnico Grancolombiano.

**Aplicacion en produccion:** [https://arqbitlabs.com/](https://arqbitlabs.com/)
**Repositorio:** [https://github.com/OscarE793/arqbit-labs](https://github.com/OscarE793/arqbit-labs)

## Caracteristicas

- **6 vistas principales**: Home, Catalogo, Detalle del Servicio, Contacto, Favoritos y Administracion (CRUD).
- **Renderizado dinamico** de servicios desde `src/assets/data/services.json` usando `HttpClient` y `BehaviorSubject`.
- **Favoritos persistentes** en `localStorage` mediante `FavoritesService`.
- **Formulario reactivo** de contacto con validaciones (`Validators.required`, `Validators.email`) y mensaje de confirmacion.
- **Mini-CRUD** para crear y eliminar servicios desde la vista de administracion.
- **Diseno responsive** con Tailwind CSS y la paleta corporativa ARQBIT (`#0B1F3A`, `#0D47A1`, `#1E88E5`, `#FF6A00`, `#FF8F00`, `#FFC107`).
- **Animaciones GSAP** con ScrollTrigger para mejorar la experiencia de usuario.
- **Tipografias**: Exo 2, Rajdhani y Source Sans 3 (Google Fonts).

## Arquitectura

```
src/
|-- app/
|   |-- core/
|   |   |-- models/          # Interfaces (Service, Testimonial)
|   |   `-- services/        # ServicesDataService, FavoritesService
|   |-- shared/
|   |   `-- components/      # Header, Footer, ServiceCard
|   |-- pages/
|   |   |-- home/
|   |   |-- catalog/
|   |   |-- service-detail/
|   |   |-- contact/
|   |   |-- favorites/
|   |   `-- admin/
|   |-- app.component.ts
|   |-- app.config.ts
|   `-- app.routes.ts
|-- assets/
|   `-- data/                # services.json, testimonials.json
|-- .htaccess                # SPA routing para Apache (Hostinger)
|-- index.html
`-- styles.css
```

## Scripts disponibles

| Comando          | Descripcion                                                 |
| ---------------- | ----------------------------------------------------------- |
| `npm start`      | Inicia el servidor de desarrollo en `http://localhost:4200` |
| `npm run build`  | Genera el bundle de produccion en `dist/arqbit-labs/`       |
| `npm run watch`  | Build en modo desarrollo con watch                          |
| `npm test`       | Ejecuta pruebas con Karma + Jasmine                         |

## Desarrollo local

```bash
git clone git@github.com:<usuario>/arqbit-labs.git
cd arqbit-labs
npm install
npm start
```

La aplicacion quedara disponible en `http://localhost:4200/`.

## Despliegue en Hostinger via SSH

El repositorio incluye un workflow de GitHub Actions (`.github/workflows/deploy-hostinger.yml`) que automatiza el build y despliegue en el hosting de Hostinger cuando se hace `push` a `main`.

### Secrets necesarios en GitHub

Configura en **Settings -> Secrets and variables -> Actions** los siguientes secrets del repositorio:

| Secret                 | Descripcion                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `HOSTINGER_SSH_KEY`    | Clave privada SSH generada para el hosting                                         |
| `HOSTINGER_HOST`       | Host/IP del servidor SSH de Hostinger                                              |
| `HOSTINGER_USER`       | Usuario SSH (`u123456789` o similar)                                               |
| `HOSTINGER_PORT`       | Puerto SSH (por defecto `65002` en Hostinger)                                      |
| `HOSTINGER_TARGET_DIR` | Ruta destino, por ejemplo `/home/u123456789/domains/arqbitlabs.com/public_html/`   |

### Pasos rapidos

1. **Generar clave SSH local** (sin passphrase para CI):

   ```bash
   ssh-keygen -t ed25519 -C "github-actions@arqbit-labs" -f ~/.ssh/arqbit_hostinger
   ```

2. **Registrar la clave publica en Hostinger**: hPanel -> Avanzado -> Acceso SSH -> *Manage SSH Keys* -> pegar `arqbit_hostinger.pub`.

3. **Copiar la clave privada** (`arqbit_hostinger`) al secret `HOSTINGER_SSH_KEY` en GitHub.

4. **Hacer push** a `main` para disparar el workflow. El job compila el proyecto y sube `dist/arqbit-labs/browser/` al `public_html` del dominio mediante `rsync` sobre SSH.

El archivo `src/.htaccess` se copia automaticamente al build y configura la redireccion SPA para que las rutas como `/servicios/1` o `/favoritos` funcionen correctamente en Apache.

## Licencia

Proyecto academico - Politecnico Grancolombiano, 2026.
