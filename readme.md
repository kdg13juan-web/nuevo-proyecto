# Mi Blog API

API REST para gestionar autores y posts. Construida con Node.js, Express y PostgreSQL.

---

## Requisitos

- Node.js 18+
- PostgreSQL 14+

---

## Instalación y setup local

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd nuevo-proyecto
npm install
```

### 2. Configurar variables de entorno

Copiá el archivo de ejemplo y completá con tus datos:

```bash
cp .env.example .env
```

Contenido de `.env`:

```
PORT=4000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=nodepg
DB_PASSWORD=tu_password
DB_PORT=5432
```

### 3. Crear la base de datos y cargar el schema

En psql o pgAdmin, ejecutá el script:

```bash
psql -U postgres -d nodepg -f docs/setup.sql
```

Esto crea las tablas `authors` y `posts` con datos de ejemplo incluidos.

### 4. Iniciar el servidor

```bash
npm start          # producción
npm run dev        # desarrollo con auto-reload
```

Servidor disponible en: `http://localhost:4000`  
Documentación Swagger: `http://localhost:4000/api-docs`

---

## Endpoints

### Autores

| Método | Ruta            | Descripción              |
|--------|-----------------|--------------------------|
| GET    | /authors        | Listar todos los autores |
| GET    | /authors/:id    | Obtener autor por ID     |
| POST   | /authors        | Crear autor              |
| PUT    | /authors/:id    | Actualizar autor         |
| DELETE | /authors/:id    | Eliminar autor           |

### Posts

| Método | Ruta                                  | Descripción                        |
|--------|---------------------------------------|------------------------------------|
| GET    | /authors/posts                        | Todos los posts con datos de autor |
| GET    | /posts/author/:authorId               | Posts de un autor (ruta alternativa)|
| GET    | /authors/:id/posts                    | Posts de un autor                  |
| GET    | /authors/:id/posts/:postId            | Post específico de un autor        |
| POST   | /authors/:id/posts                    | Crear post para un autor           |
| PUT    | /authors/:authorId/posts/:postId      | Actualizar post                    |
| DELETE | /authors/:authorId/posts/:postId      | Eliminar post                      |

---

## Tests

Los tests usan Jest + Supertest y corren contra tu base de datos local.

```bash
npm test
```

Para ver cobertura:

```bash
npm run test:coverage
```

> Los tests crean y eliminan sus propios datos. No modifican el seed existente.

---

## Deploy en Railway

### 1. Crear cuenta en Railway

Entrá a [railway.app](https://railway.app) y creá una cuenta con GitHub.

### 2. Crear proyecto

- Click en **New Project → Deploy from GitHub repo**
- Seleccioná tu repositorio

### 3. Agregar PostgreSQL

- Dentro del proyecto, click en **+ New → Database → PostgreSQL**
- Railway crea la base de datos y te da las variables de conexión automáticamente

### 4. Configurar variables de entorno en Railway

En el panel de tu servicio, ir a **Variables** y agregar:

```
PORT=4000
DB_USER=<desde Railway>
DB_HOST=<desde Railway>
DB_NAME=<desde Railway>
DB_PASSWORD=<desde Railway>
DB_PORT=<desde Railway>
```

Railway también provee la variable `DATABASE_URL` — podés usarla directamente en `db.js` si preferís.

### 5. Ejecutar el setup SQL

Desde la consola de Railway (o conectándote con psql a la URL que Railway te da):

```bash
psql <DATABASE_URL> -f docs/setup.sql
```

### 6. Deploy automático

Cada push a `main` despliega automáticamente. Railway te da una URL pública tipo:

```
https://tu-proyecto.up.railway.app
```

---

## Estructura del proyecto

```
nuevo-proyecto/
├── src/
│   ├── controllers/
│   │   ├── authors.controllers.js
│   │   └── posts.controllers.js
│   ├── routes/
│   │   ├── authors.routes.js
│   │   └── posts.routes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── db.js
│   └── index.js
├── docs/
│   ├── openapi.yaml
│   └── setup.sql
├── tests/
│   └── api.test.js
├── .env.example
├── package.json
└── README.md
```
